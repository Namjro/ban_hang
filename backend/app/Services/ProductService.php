<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * Get public products with search, filtering, sorting, pagination, and SKU meta.
     */
    public function getPublicProducts(array $filters): array
    {
        $query = Product::with('category');

        if (!empty($filters['search'])) {
            $keyword = $filters['search'];
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('sku', 'like', "%{$keyword}%")
                  ->orWhere('brand', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if (!empty($filters['category'])) {
            $categorySlug = $filters['category'];
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                  ->orWhere('id', $categorySlug);
            });
        }

        if (!empty($filters['brand'])) {
            $query->where('brand', $filters['brand']);
        }

        if (!empty($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }

        if (isset($filters['featured']) && filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN)) {
            $query->where('is_featured', true);
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $perPage = (int) ($filters['per_page'] ?? 12);
        $paginator = $query->paginate($perPage);

        return [
            'paginator' => $paginator,
            'meta'      => [
                'total_sku'    => Product::count(),
                'in_stock_sku' => Product::where('stock_status', 'in_stock')->count(),
            ],
        ];
    }

    /**
     * Find product by identifier (slug, sku, or id) and load related products.
     */
    public function getPublicProductByIdentifier(string $identifier): array
    {
        $product = Product::with('category')
            ->where('slug', $identifier)
            ->orWhere('sku', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return [
            'product'          => $product,
            'related_products' => $relatedProducts,
        ];
    }

    /**
     * Get distinct products for the Quick Spec Table.
     */
    public function getQuickSpecProducts(): Collection
    {
        return Product::with('category')
            ->whereIn('sku', ['AX-WH-100', 'AX-PM-150', 'AX-EM-4FL-10', 'AX-BR-6205-2RS', 'AX-CNC-VMC850', 'AX-LUB-EMUL20L'])
            ->get();
    }

    /**
     * Get admin products with search, category/stock filtering, and pagination.
     */
    public function getAdminProducts(array $filters): LengthAwarePaginator
    {
        $query = Product::with('category');

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['stock_status'])) {
            $query->where('stock_status', $filters['stock_status']);
        }

        $perPage = (int) ($filters['per_page'] ?? 15);

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Find product by id for admin.
     */
    public function getAdminProductById(int $id): Product
    {
        return Product::with('category')->findOrFail($id);
    }

    /**
     * Create a new product.
     */
    public function createProduct(array $data): Product
    {
        $data['slug'] = Str::slug($data['name'] . '-' . $data['sku']);
        $data['brand'] = $data['brand'] ?? 'Axiom';
        $data['price_display'] = $data['price_display'] ?? 'Liên hệ báo giá';
        $data['has_cocq'] = $data['has_cocq'] ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;

        if (!empty($data['images']) && empty($data['image_url'])) {
            $data['image_url'] = $data['images'][0];
        } elseif (!empty($data['image_url']) && empty($data['images'])) {
            $data['images'] = [$data['image_url']];
        }

        $product = Product::create($data);

        return $product->load('category');
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(int $id, array $data): Product
    {
        $product = Product::findOrFail($id);

        if (isset($data['name']) || isset($data['sku'])) {
            $name = $data['name'] ?? $product->name;
            $sku = $data['sku'] ?? $product->sku;
            $data['slug'] = Str::slug($name . '-' . $sku);
        }

        if (isset($data['images']) && !empty($data['images']) && empty($data['image_url'])) {
            $data['image_url'] = $data['images'][0];
        }

        $product->update($data);

        return $product->load('category');
    }

    /**
     * Delete a product by id.
     */
    public function deleteProduct(int $id): void
    {
        $product = Product::findOrFail($id);
        $product->delete();
    }

    /**
     * Upload and store product image files.
     *
     * @param array<UploadedFile> $files
     * @return array<string>
     */
    public function uploadProductImages(array $files, string $schemeAndHttpHost): array
    {
        $targetDir = public_path('uploads' . DIRECTORY_SEPARATOR . 'products');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $uploadedUrls = [];
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }

            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, $allowed)) {
                continue;
            }

            $filename = 'axiom_' . time() . '_' . Str::random(8) . '.' . $extension;
            $destinationPath = $targetDir . DIRECTORY_SEPARATOR . $filename;

            if (@copy($file->getRealPath(), $destinationPath) || @file_put_contents($destinationPath, file_get_contents($file->getRealPath()))) {
                $uploadedUrls[] = $schemeAndHttpHost . '/uploads/products/' . $filename;
            }
        }

        return $uploadedUrls;
    }
}

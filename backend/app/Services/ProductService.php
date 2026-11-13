<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(
        protected MediaService $mediaService,
        protected SeoGeneratorService $seoGenerator
    ) {}

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
            $categorySlug = (string) $filters['category'];
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
                if (ctype_digit($categorySlug)) {
                    $q->orWhere('id', (int) $categorySlug);
                }
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
        $identifier = trim($identifier);

        $product = Product::with('category')
            ->where(function ($q) use ($identifier) {
                $q->where('slug', $identifier)
                  ->orWhere('sku', $identifier);

                if (ctype_digit($identifier)) {
                    $q->orWhere('id', (int) $identifier);
                }
            })
            ->first();

        if (!$product) {
            $category = Category::where('slug', $identifier)
                ->when(ctype_digit($identifier), fn ($q) => $q->orWhere('id', (int) $identifier))
                ->first();

            if ($category) {
                $product = Product::with('category')
                    ->where('category_id', $category->id)
                    ->orderBy('is_featured', 'desc')
                    ->orderBy('id', 'asc')
                    ->first();
            }
        }

        if (!$product) {
            throw new \Illuminate\Database\Eloquent\ModelNotFoundException('Không tìm thấy sản phẩm phù hợp.');
        }

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
     * Get products flagged for the homepage Quick Spec Table.
     */
    public function getQuickSpecProducts(): Collection
    {
        return Product::with('category')
            ->where('show_in_quick_specs', true)
            ->orderBy('quick_spec_order')
            ->orderBy('id')
            ->limit(10)
            ->get();
    }

    /**
     * Get the distinct list of brands currently used by products.
     *
     * @return array<string>
     */
    public function getPublicBrands(): array
    {
        return Product::query()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->distinct()
            ->orderBy('brand')
            ->pluck('brand')
            ->all();
    }

    /**
     * Get lightweight product entries for XML sitemap generation.
     */
    public function getSitemapProducts(): Collection
    {
        return Product::query()
            ->select(['id', 'slug', 'name', 'image_url', 'updated_at'])
            ->orderBy('id', 'desc')
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

        $category = isset($data['category_id']) ? Category::find($data['category_id']) : null;
        $data = $this->seoGenerator->fillProductSeo($data, $category);

        $product = Product::create($data);

        return $product->load('category');
    }

    /**
     * Update an existing product.
     */
    public function updateProduct(int $id, array $data): Product
    {
        $product = Product::with('category')->findOrFail($id);

        if (isset($data['name']) || isset($data['sku'])) {
            $name = $data['name'] ?? $product->name;
            $sku = $data['sku'] ?? $product->sku;
            $data['slug'] = Str::slug($name . '-' . $sku);
        }

        if (isset($data['images']) && !empty($data['images']) && empty($data['image_url'])) {
            $data['image_url'] = $data['images'][0];
        }

        $category = isset($data['category_id'])
            ? Category::find($data['category_id'])
            : $product->category;

        $mergedForSeo = array_merge([
            'name'             => $product->name,
            'sku'              => $product->sku,
            'brand'            => $product->brand,
            'spec_summary'     => $product->spec_summary,
            'description'      => $product->description,
            'meta_title'       => $product->meta_title,
            'meta_description' => $product->meta_description,
            'meta_keywords'    => $product->meta_keywords,
        ], $data);

        $filledSeo = $this->seoGenerator->fillProductSeo($mergedForSeo, $category);
        $data['meta_title'] = $filledSeo['meta_title'] ?? null;
        $data['meta_description'] = $filledSeo['meta_description'] ?? null;
        $data['meta_keywords'] = $filledSeo['meta_keywords'] ?? null;

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
        return $this->mediaService->storeImages($files, $schemeAndHttpHost, 'products');
    }
}

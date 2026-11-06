<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class ProductAdminController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($stock = $request->input('stock_status')) {
            $query->where('stock_status', $stock);
        }

        $perPage = $request->input('per_page', 15);
        $products = $query->orderBy('id', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'category_id' => 'required|exists:categories,id',
            'sku' => 'required|string|max:50|unique:products,sku',
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'images' => 'nullable|array',
            'images.*' => 'string|max:500',
            'description' => 'nullable|string',
            'specifications' => 'nullable|array',
            'stock_status' => 'required|in:in_stock,low_stock,pre_order',
            'price_display' => 'nullable|string|max:100',
            'has_cocq' => 'boolean',
            'certificates' => 'nullable|array',
            'certificates.*' => 'string|max:255',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['name'] . '-' . $data['sku']);
        $data['brand'] = $data['brand'] ?? 'Axiom';
        $data['price_display'] = $data['price_display'] ?? 'Liên hệ báo giá';
        $data['has_cocq'] = $data['has_cocq'] ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;

        // Sync primary image_url with images array
        if (!empty($data['images']) && empty($data['image_url'])) {
            $data['image_url'] = $data['images'][0];
        } elseif (!empty($data['image_url']) && empty($data['images'])) {
            $data['images'] = [$data['image_url']];
        }

        $product = Product::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Thêm sản phẩm mới thành công.',
            'data' => $product->load('category')
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'category_id' => 'sometimes|exists:categories,id',
            'sku' => "sometimes|string|max:50|unique:products,sku,{$id}",
            'name' => 'sometimes|string|max:255',
            'brand' => 'nullable|string|max:100',
            'image_url' => 'nullable|string|max:500',
            'images' => 'nullable|array',
            'images.*' => 'string|max:500',
            'description' => 'nullable|string',
            'specifications' => 'nullable|array',
            'stock_status' => 'sometimes|in:in_stock,low_stock,pre_order',
            'price_display' => 'nullable|string|max:100',
            'has_cocq' => 'boolean',
            'certificates' => 'nullable|array',
            'certificates.*' => 'string|max:255',
            'is_featured' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['name']) || isset($data['sku'])) {
            $name = $data['name'] ?? $product->name;
            $sku = $data['sku'] ?? $product->sku;
            $data['slug'] = Str::slug($name . '-' . $sku);
        }

        // Sync primary image_url with images array
        if (isset($data['images']) && !empty($data['images']) && empty($data['image_url'])) {
            $data['image_url'] = $data['images'][0];
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công.',
            'data' => $product->load('category')
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm thành công.'
        ]);
    }

    public function uploadImages(Request $request): JsonResponse
    {
        $files = [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            if (!is_array($files)) {
                $files = [$files];
            }
        } elseif ($request->hasFile('image')) {
            $files = [$request->file('image')];
        } elseif ($request->hasFile('file')) {
            $files = [$request->file('file')];
        }

        if (empty($files)) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tệp ảnh tải lên.'
            ], 422);
        }

        $targetDir = public_path('uploads' . DIRECTORY_SEPARATOR . 'products');
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        $uploadedUrls = [];
        $requestHost = $request->getSchemeAndHttpHost();

        foreach ($files as $file) {
            $extension = strtolower($file->getClientOriginalExtension());
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (!in_array($extension, $allowed)) {
                continue;
            }

            $filename = 'axiom_' . time() . '_' . Str::random(8) . '.' . $extension;
            $destinationPath = $targetDir . DIRECTORY_SEPARATOR . $filename;
            
            // Use copy / file_put_contents to avoid Symfony's Windows is_writable bug on NTFS folders
            if (@copy($file->getRealPath(), $destinationPath) || @file_put_contents($destinationPath, file_get_contents($file->getRealPath()))) {
                $uploadedUrls[] = $requestHost . '/uploads/products/' . $filename;
            }
        }

        if (empty($uploadedUrls)) {
            return response()->json([
                'success' => false,
                'message' => 'Định dạng tệp không được hỗ trợ. Vui lòng tải file ảnh (JPG, PNG, WEBP, GIF, SVG).'
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tải lên thành công ' . count($uploadedUrls) . ' ảnh.',
            'data' => $uploadedUrls
        ]);
    }
}

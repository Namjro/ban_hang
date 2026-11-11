<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\AdminProductFilterRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Requests\Product\UploadProductImagesRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductAdminController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index(AdminProductFilterRequest $request): JsonResponse
    {
        $products = $this->productService->getAdminProducts($request->validated());

        return response()->json([
            'success'    => true,
            'data'       => ProductResource::collection($products->items()),
            'pagination' => [
                'total'        => $products->total(),
                'per_page'     => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page'    => $products->lastPage(),
            ],
        ]);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Thêm sản phẩm mới thành công.',
            'data'    => new ProductResource($product),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->productService->getAdminProductById($id);

        return response()->json([
            'success' => true,
            'data'    => new ProductResource($product),
        ]);
    }

    public function update(UpdateProductRequest $request, int $id): JsonResponse
    {
        $product = $this->productService->updateProduct($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công.',
            'data'    => new ProductResource($product),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->productService->deleteProduct($id);

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa sản phẩm thành công.',
        ]);
    }

    public function uploadImages(UploadProductImagesRequest $request): JsonResponse
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
                'message' => 'Không tìm thấy tệp ảnh tải lên.',
            ], 422);
        }

        $uploadedUrls = $this->productService->uploadProductImages($files, $request->getSchemeAndHttpHost());

        if (empty($uploadedUrls)) {
            return response()->json([
                'success' => false,
                'message' => 'Định dạng tệp không được hỗ trợ. Vui lòng tải file ảnh (JPG, PNG, WEBP, GIF, SVG).',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tải lên thành công ' . count($uploadedUrls) . ' ảnh.',
            'data'    => $uploadedUrls,
        ]);
    }
}

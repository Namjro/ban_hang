<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductFilterRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index(ProductFilterRequest $request): JsonResponse
    {
        $result = $this->productService->getPublicProducts($request->validated());
        $paginator = $result['paginator'];

        return response()->json([
            'success'    => true,
            'data'       => ProductResource::collection($paginator->items()),
            'pagination' => [
                'total'        => $paginator->total(),
                'per_page'     => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
            ],
            'meta'       => $result['meta'],
        ]);
    }

    public function show(string $identifier): JsonResponse
    {
        $result = $this->productService->getPublicProductByIdentifier($identifier);

        return response()->json([
            'success'          => true,
            'data'             => new ProductResource($result['product']),
            'related_products' => ProductResource::collection($result['related_products']),
        ]);
    }

    public function quickSpecs(): JsonResponse
    {
        $products = $this->productService->getQuickSpecProducts();

        return response()->json([
            'success' => true,
            'data'    => ProductResource::collection($products),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        // Search by keyword in name, sku, brand, description
        if ($keyword = $request->input('search')) {
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('sku', 'like', "%{$keyword}%")
                  ->orWhere('brand', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Filter by category slug or ID
        if ($categorySlug = $request->input('category')) {
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug)
                  ->orWhere('id', $categorySlug);
            });
        }

        // Filter by brand
        if ($brand = $request->input('brand')) {
            $query->where('brand', $brand);
        }

        // Filter by stock status
        if ($stock = $request->input('stock_status')) {
            $query->where('stock_status', $stock);
        }

        // Filter featured only
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Sorting
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->input('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $products->items(),
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ],
            'meta' => [
                'total_sku' => Product::count(),
                'in_stock_sku' => Product::where('stock_status', 'in_stock')->count(),
            ]
        ]);
    }

    public function show(string $identifier): JsonResponse
    {
        $product = Product::with('category')
            ->where('slug', $identifier)
            ->orWhere('sku', $identifier)
            ->orWhere('id', $identifier)
            ->firstOrFail();

        // Get up to 4 related products in the same category
        $relatedProducts = Product::with('category')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $product,
            'related_products' => $relatedProducts
        ]);
    }

    public function quickSpecs(): JsonResponse
    {
        // 6 distinct products for the landing page Quick Spec Table
        $products = Product::with('category')
            ->whereIn('sku', ['AX-WH-100', 'AX-PM-150', 'AX-EM-4FL-10', 'AX-BR-6205-2RS', 'AX-CNC-VMC850', 'AX-LUB-EMUL20L'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}

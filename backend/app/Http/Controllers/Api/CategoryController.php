<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\PublicCategoryFilterRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    public function index(PublicCategoryFilterRequest $request): JsonResponse
    {
        $homeOnly = (bool) ($request->validated()['home'] ?? false);
        $categories = $this->categoryService->getPublicCategories($homeOnly);

        return response()->json([
            'success' => true,
            'data'    => CategoryResource::collection($categories),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = $this->categoryService->getPublicCategoryBySlug($slug);

        return response()->json([
            'success' => true,
            'data'    => new CategoryResource($category),
        ]);
    }
}

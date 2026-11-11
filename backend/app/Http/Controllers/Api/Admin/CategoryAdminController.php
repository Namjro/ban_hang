<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CategoryFilterRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryService;
use DomainException;
use Illuminate\Http\JsonResponse;

class CategoryAdminController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    public function index(CategoryFilterRequest $request): JsonResponse
    {
        $result = $this->categoryService->getAdminCategories($request->validated('search'));

        return response()->json([
            'success' => true,
            'data'    => CategoryResource::collection($result['categories']),
            'meta'    => $result['meta'],
        ]);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Tạo mới danh mục thành công.',
            'data'    => new CategoryResource($category),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $category = $this->categoryService->getAdminCategoryById($id);

        return response()->json([
            'success' => true,
            'data'    => new CategoryResource($category),
        ]);
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->updateCategory($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công.',
            'data'    => new CategoryResource($category),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->categoryService->deleteCategory($id);

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa danh mục thành công.',
            ]);
        } catch (DomainException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

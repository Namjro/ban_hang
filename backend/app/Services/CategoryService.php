<?php

namespace App\Services;

use App\Models\Category;
use DomainException;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class CategoryService
{
    public function __construct(
        protected SeoGeneratorService $seoGenerator
    ) {}

    /**
     * Get public category list with product counts.
     * When $homeOnly is true, only categories flagged for the homepage are returned.
     */
    public function getPublicCategories(bool $homeOnly = false): Collection
    {
        return Category::withCount('products')
            ->with(['products' => fn ($q) => $q->orderBy('is_featured', 'desc')->orderBy('id', 'asc')])
            ->when($homeOnly, fn ($q) => $q->where('show_on_home', true))
            ->orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();
    }

    /**
     * Get public category detail by slug with products.
     */
    public function getPublicCategoryBySlug(string $slug): Category
    {
        return Category::where('slug', $slug)
            ->with(['products'])
            ->firstOrFail();
    }

    /**
     * Get admin categories list with optional search and summary meta.
     */
    public function getAdminCategories(?string $search = null): array
    {
        $query = Category::withCount('products');

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return [
            'categories' => $categories,
            'meta'       => [
                'total_categories' => $categories->count(),
                'total_products'   => $categories->sum('products_count'),
            ],
        ];
    }

    /**
     * Find category by id for admin.
     */
    public function getAdminCategoryById(int $id): Category
    {
        return Category::withCount('products')
            ->with('products')
            ->findOrFail($id);
    }

    /**
     * Create a new category.
     */
    public function createCategory(array $data): Category
    {
        if (empty($data['slug'])) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Category::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $data['order'] = $data['order'] ?? 0;
        $data['icon'] = $data['icon'] ?? 'folder';
        $data = $this->seoGenerator->fillCategorySeo($data);

        $category = Category::create($data);

        return $category->loadCount('products');
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(int $id, array $data): Category
    {
        $category = Category::findOrFail($id);

        if (isset($data['name']) && empty($data['slug'])) {
            $baseSlug = Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }

        $mergedForSeo = array_merge([
            'name'             => $category->name,
            'subtitle'         => $category->subtitle,
            'description'      => $category->description,
            'meta_title'       => $category->meta_title,
            'meta_description' => $category->meta_description,
            'meta_keywords'    => $category->meta_keywords,
        ], $data);

        $filledSeo = $this->seoGenerator->fillCategorySeo($mergedForSeo);
        $data['meta_title'] = $filledSeo['meta_title'] ?? null;
        $data['meta_description'] = $filledSeo['meta_description'] ?? null;
        $data['meta_keywords'] = $filledSeo['meta_keywords'] ?? null;

        $category->update($data);

        return $category->loadCount('products');
    }

    /**
     * Delete a category.
     *
     * @throws DomainException
     */
    public function deleteCategory(int $id): void
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            throw new DomainException(
                "Không thể xóa danh mục '{$category->name}' vì đang có {$category->products_count} sản phẩm trực thuộc. Vui lòng chuyển hoặc xóa các sản phẩm này trước."
            );
        }

        $category->delete();
    }
}

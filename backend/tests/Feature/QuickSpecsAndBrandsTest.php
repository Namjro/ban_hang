<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Tests\TestCase;

class QuickSpecsAndBrandsTest extends TestCase
{
    private function getAdminToken(): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        return (string) $response->json('access_token');
    }

    public function test_public_quick_specs_returns_flagged_products_in_order(): void
    {
        $response = $this->getJson('/api/products/quick-specs');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $items = $response->json('data');
        $this->assertGreaterThanOrEqual(6, count($items));
        $this->assertTrue($items[0]['show_in_quick_specs']);
        $this->assertNotEmpty($items[0]['spec_summary']);
    }

    public function test_public_brands_returns_distinct_sorted_brands_and_updates_when_product_added(): void
    {
        $token = $this->getAdminToken();
        $categoryId = Category::firstOrFail()->id;

        $uniqueBrand = 'ZZ-TestBrand-' . uniqid();
        $created = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/products', [
                'category_id'         => $categoryId,
                'sku'                 => 'TEST-BRAND-' . uniqid(),
                'name'                => 'Sản phẩm test brand',
                'brand'               => $uniqueBrand,
                'stock_status'        => 'in_stock',
                'show_in_quick_specs' => false,
                'highlights'          => ['Ưu điểm riêng 1'],
                'packaging'           => ['Đóng gói riêng 1'],
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.highlights.0', 'Ưu điểm riêng 1')
            ->json('data');

        $brandsResponse = $this->getJson('/api/products/brands')->assertStatus(200);
        $this->assertContains($uniqueBrand, $brandsResponse->json('data'));

        // Clean up
        Product::find($created['id'])?->delete();
    }
}

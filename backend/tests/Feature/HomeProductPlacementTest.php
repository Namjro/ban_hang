<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Tests\TestCase;

class HomeProductPlacementTest extends TestCase
{
    private function getAdminToken(): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        return (string) $response->json('access_token');
    }

    public function test_public_home_featured_returns_ordered_products_for_section_01(): void
    {
        $response = $this->getJson('/api/products/home-featured');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $items = $response->json('data');
        $this->assertNotEmpty($items);
        $this->assertTrue($items[0]['show_on_home']);

        // Verify ordering: home_order asc
        for ($i = 0; $i < count($items) - 1; $i++) {
            $this->assertLessThanOrEqual($items[$i + 1]['home_order'], $items[$i]['home_order']);
        }
    }

    public function test_public_quick_specs_includes_datasheet_and_section_02_data(): void
    {
        $response = $this->getJson('/api/products/quick-specs');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $items = $response->json('data');
        $this->assertNotEmpty($items);
        $this->assertTrue($items[0]['show_in_quick_specs']);
        $this->assertArrayHasKey('datasheet_url', $items[0]);
    }

    public function test_admin_can_create_and_update_home_placement_and_datasheet(): void
    {
        $token = $this->getAdminToken();
        $categoryId = Category::firstOrFail()->id;
        $sku = 'TEST-HOME-' . uniqid();

        // 1. Create with show_on_home and show_in_quick_specs
        $createdResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/products', [
                'category_id'         => $categoryId,
                'sku'                 => $sku,
                'name'                => 'Thiết bị kiểm thử Mục 01 & 02',
                'brand'               => 'Axiom Test',
                'stock_status'        => 'in_stock',
                'show_on_home'        => true,
                'home_order'          => 99,
                'show_in_quick_specs' => true,
                'quick_spec_order'    => 88,
                'spec_summary'        => 'Thông số thử nghiệm nhanh',
                'datasheet_url'       => 'https://example.com/datasheet-test.pdf',
            ]);

        $createdResponse->assertStatus(201)
            ->assertJsonPath('data.show_on_home', true)
            ->assertJsonPath('data.home_order', 99)
            ->assertJsonPath('data.show_in_quick_specs', true)
            ->assertJsonPath('data.quick_spec_order', 88)
            ->assertJsonPath('data.datasheet_url', 'https://example.com/datasheet-test.pdf');

        $productId = (int) $createdResponse->json('data.id');

        // 2. Update home placement
        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/admin/products/{$productId}", [
                'home_order'       => 5,
                'quick_spec_order' => 3,
                'datasheet_url'    => 'https://example.com/updated-datasheet.pdf',
            ]);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('data.home_order', 5)
            ->assertJsonPath('data.quick_spec_order', 3)
            ->assertJsonPath('data.datasheet_url', 'https://example.com/updated-datasheet.pdf');

        // Clean up
        Product::find($productId)?->delete();
    }

    public function test_admin_can_filter_products_by_home_placement_and_datasheet(): void
    {
        $token = $this->getAdminToken();

        // Filter show_on_home
        $homeResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/products?show_on_home=1')
            ->assertStatus(200);

        foreach ($homeResponse->json('data') as $item) {
            $this->assertTrue($item['show_on_home']);
        }

        // Filter show_in_quick_specs
        $specResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/products?show_in_quick_specs=1')
            ->assertStatus(200);

        foreach ($specResponse->json('data') as $item) {
            $this->assertTrue($item['show_in_quick_specs']);
        }

        // Filter has_datasheet
        $docResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/products?has_datasheet=1')
            ->assertStatus(200);

        foreach ($docResponse->json('data') as $item) {
            $this->assertNotEmpty($item['datasheet_url']);
        }
    }
}

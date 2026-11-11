<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\QuoteRequest;
use Tests\TestCase;

class AuthAndProductApiTest extends TestCase
{
    private function getAdminToken(): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        return (string) $response->json('access_token');
    }

    public function test_can_login_with_jwt(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'access_token',
                'token_type',
                'expires_in',
                'user' => ['id', 'name', 'email', 'role'],
            ]);

        $token = $response->json('access_token');
        $this->assertNotEmpty($token);

        // Test authenticated me endpoint
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $meResponse->assertStatus(200)
            ->assertJsonPath('user.email', 'admin@axiom.vn');
    }

    public function test_validation_error_format_on_form_request(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'invalid-email',
            'password' => '123',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => ['email', 'password'],
            ])
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Dữ liệu đăng nhập không hợp lệ.');
    }

    public function test_public_can_fetch_categories(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => ['id', 'name', 'slug', 'description', 'icon', 'order'],
                ],
            ]);

        $firstCategory = Category::first();
        if ($firstCategory) {
            $showResponse = $this->getJson('/api/categories/' . $firstCategory->slug);
            $showResponse->assertStatus(200)
                ->assertJsonPath('success', true)
                ->assertJsonPath('data.slug', $firstCategory->slug);
        }
    }

    public function test_public_can_fetch_products(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'pagination' => ['total', 'per_page', 'current_page', 'last_page'],
                'meta'       => ['total_sku', 'in_stock_sku'],
            ]);

        $this->assertGreaterThan(0, count($response->json('data')));
    }

    public function test_public_can_fetch_product_detail_and_quick_specs(): void
    {
        $quickSpecsResponse = $this->getJson('/api/products/quick-specs');
        $quickSpecsResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        $product = Product::first();
        if ($product) {
            $showResponse = $this->getJson('/api/products/' . $product->slug);
            $showResponse->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => ['id', 'sku', 'name', 'slug', 'category'],
                    'related_products',
                ]);
        }
    }

    public function test_public_can_submit_quote_request(): void
    {
        $response = $this->postJson('/api/quote-requests', [
            'full_name'           => 'Nguyễn Văn Kỹ Thuật',
            'company_name'        => 'Công ty Cơ khí Chính xác Tân Bình',
            'phone'               => '0912345678',
            'email'               => 'kythuat@tanbinhmec.vn',
            'sku_target'          => 'AX-PM-150',
            'requirement_content' => 'Cần báo giá 5 chiếc thước kẹp điện tử Mitutoyo kèm chứng nhận hiệu chuẩn CO/CQ.',
            'source'              => 'landing_form',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'message',
                'data' => ['id', 'status', 'created_at'],
            ]);
    }

    public function test_admin_dashboard_stats(): void
    {
        $token = $this->getAdminToken();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'overview' => [
                        'total_products',
                        'in_stock_products',
                        'total_categories',
                        'total_quotes',
                        'new_quotes',
                        'contacted_quotes',
                        'quoted_quotes',
                        'completed_quotes',
                    ],
                    'recent_quotes',
                ],
            ]);
    }

    public function test_admin_category_and_quote_operations(): void
    {
        $token = $this->getAdminToken();

        // 1. Admin quotes list
        $quotesResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/quotes');

        $quotesResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // 2. Update quote status if exists
        $quote = QuoteRequest::latest()->first();
        if ($quote) {
            $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
                ->patchJson('/api/admin/quotes/' . $quote->id . '/status', [
                    'status'      => 'contacted',
                    'admin_notes' => 'Đã gọi điện tư vấn kỹ thuật trực tiếp.',
                ]);

            $updateResponse->assertStatus(200)
                ->assertJsonPath('data.status', 'contacted')
                ->assertJsonPath('data.admin_notes', 'Đã gọi điện tư vấn kỹ thuật trực tiếp.');
        }

        // 3. Admin create, update, delete category
        $createCatResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/categories', [
                'name'        => 'Test Category ' . uniqid(),
                'description' => 'Mô tả test',
                'icon'        => 'cpu',
                'order'       => 99,
            ]);

        $createCatResponse->assertStatus(201)
            ->assertJsonPath('success', true);

        $catId = $createCatResponse->json('data.id');

        $deleteCatResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/admin/categories/' . $catId);

        $deleteCatResponse->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}

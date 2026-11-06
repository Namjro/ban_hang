<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Product;
use Tests\TestCase;

class AuthAndProductApiTest extends TestCase
{
    public function test_can_login_with_jwt(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'access_token',
                'token_type',
                'expires_in',
                'user' => ['id', 'name', 'email', 'role']
            ]);

        $token = $response->json('access_token');
        $this->assertNotEmpty($token);

        // Test authenticated me endpoint
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/auth/me');

        $meResponse->assertStatus(200)
            ->assertJsonPath('user.email', 'admin@axiom.vn');
    }

    public function test_public_can_fetch_products(): void
    {
        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data',
                'pagination',
                'meta'
            ]);

        $this->assertGreaterThan(0, count($response->json('data')));
    }

    public function test_public_can_submit_quote_request(): void
    {
        $response = $this->postJson('/api/quote-requests', [
            'full_name' => 'Nguyễn Văn Kỹ Thuật',
            'company_name' => 'Công ty Cơ khí Chính xác Tân Bình',
            'phone' => '0912345678',
            'email' => 'kythuat@tanbinhmec.vn',
            'sku_target' => 'AX-PM-150',
            'requirement_content' => 'Cần báo giá 5 chiếc thước kẹp điện tử Mitutoyo kèm chứng nhận hiệu chuẩn CO/CQ.',
            'source' => 'landing_form',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);
    }
}

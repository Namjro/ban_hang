<?php

namespace Tests\Feature;

use Tests\TestCase;

class SiteSettingApiTest extends TestCase
{
    private function getAdminToken(): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        return (string) $response->json('access_token');
    }

    public function test_public_can_fetch_all_site_settings(): void
    {
        $response = $this->getJson('/api/settings');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'company' => ['name', 'hotline_display', 'hotline_tel', 'email', 'address'],
                    'hero' => ['eyebrow', 'title', 'subtitle', 'badges', 'image_url'],
                    'trust_stats' => ['items'],
                    'capabilities' => ['eyebrow', 'title', 'description', 'image_url', 'items'],
                    'product_detail' => ['discount_note', 'vat_note', 'invoice_note', 'guarantees', 'highlights', 'packaging', 'default_certificates'],
                ],
            ]);
    }

    public function test_admin_settings_endpoints_require_authentication(): void
    {
        $this->getJson('/api/admin/settings/company')->assertStatus(401);
        $this->putJson('/api/admin/settings/company', ['name' => 'Test'])->assertStatus(401);
    }

    public function test_admin_can_fetch_and_update_site_setting_group(): void
    {
        $token = $this->getAdminToken();

        $original = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/settings/company')
            ->assertStatus(200)
            ->json('data');

        $updatedPayload = array_merge($original, [
            'hotline_display' => '0999.888.777',
            'hotline_tel'     => '0999888777',
        ]);

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/company', $updatedPayload)
            ->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.hotline_display', '0999.888.777');

        // Public endpoint reflects the updated value
        $this->getJson('/api/settings')
            ->assertStatus(200)
            ->assertJsonPath('data.company.hotline_display', '0999.888.777');

        // Restore original settings
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/company', $original)
            ->assertStatus(200);
    }

    public function test_admin_settings_validation_returns_422(): void
    {
        $token = $this->getAdminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/company', [
                'name'            => '',
                'hotline_display' => '0988',
                'hotline_tel'     => 'abc-invalid',
                'email'           => 'not-an-email',
                'address'         => '',
            ])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['name', 'hotline_tel', 'email', 'address']]);
    }

    public function test_unknown_settings_group_returns_404(): void
    {
        $token = $this->getAdminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/settings/non_existent_group')
            ->assertStatus(404)
            ->assertJsonPath('success', false);
    }

    public function test_admin_can_update_hero_slides_and_validates_slide_image(): void
    {
        $token = $this->getAdminToken();

        $original = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/settings/hero')
            ->assertStatus(200)
            ->json('data');

        // Reject missing image_url inside slide
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/hero', array_merge($original, [
                'slides' => [
                    ['image_url' => '', 'caption_left' => 'Test', 'caption_right' => 'Test'],
                ],
            ]))
            ->assertStatus(422)
            ->assertJsonStructure(['errors' => ['slides.0.image_url']]);

        // Accept valid slides array and sync first slide to image_url
        $newSlides = [
            ['image_url' => '/assets/images/warehouse.png', 'caption_left' => 'SLIDE 1', 'caption_right' => 'R1'],
            ['image_url' => '/assets/images/cat-cnc.png', 'caption_left' => 'SLIDE 2', 'caption_right' => 'R2'],
        ];

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/hero', array_merge($original, ['slides' => $newSlides]))
            ->assertStatus(200)
            ->assertJsonPath('data.image_url', '/assets/images/warehouse.png')
            ->assertJsonCount(2, 'data.slides');

        // Restore original hero settings
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/admin/settings/hero', $original)
            ->assertStatus(200);
    }
}

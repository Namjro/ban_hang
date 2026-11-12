<?php

namespace Tests\Feature;

use App\Models\Category;
use Tests\TestCase;

class CategoryDisplayFieldsTest extends TestCase
{
    private function getAdminToken(): string
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'admin@axiom.vn',
            'password' => 'Password@123',
        ]);

        return (string) $response->json('access_token');
    }

    public function test_public_categories_include_display_fields_and_support_home_filter(): void
    {
        $token = $this->getAdminToken();

        $created = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/categories', [
                'name'         => 'Danh mục ẩn trang chủ',
                'subtitle'     => 'PHỤ KIỆN TEST',
                'image_url'    => '/assets/images/cat-cnc.png',
                'highlights'   => [
                    ['label' => 'Thiết bị', 'value' => 'Test A, Test B'],
                ],
                'show_on_home' => false,
                'order'        => 99,
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.subtitle', 'PHỤ KIỆN TEST')
            ->assertJsonPath('data.show_on_home', false)
            ->json('data');

        $homeResponse = $this->getJson('/api/categories?home=1')->assertStatus(200);
        $homeSlugs = collect($homeResponse->json('data'))->pluck('slug')->all();
        $this->assertNotContains($created['slug'], $homeSlugs);

        $allResponse = $this->getJson('/api/categories')->assertStatus(200);
        $allSlugs = collect($allResponse->json('data'))->pluck('slug')->all();
        $this->assertContains($created['slug'], $allSlugs);

        // Clean up
        Category::find($created['id'])?->delete();
    }

    public function test_category_highlights_validation_rejects_more_than_two_items(): void
    {
        $token = $this->getAdminToken();

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/admin/categories', [
                'name'       => 'Danh mục test',
                'highlights' => [
                    ['label' => '1', 'value' => 'a'],
                    ['label' => '2', 'value' => 'b'],
                    ['label' => '3', 'value' => 'c'],
                ],
            ])
            ->assertStatus(422)
            ->assertJsonPath('success', false)
            ->assertJsonStructure(['errors' => ['highlights']]);
    }
}

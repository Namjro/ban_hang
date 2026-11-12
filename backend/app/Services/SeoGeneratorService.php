<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;

class SeoGeneratorService
{
    /**
     * Fill missing SEO fields for a product payload using its attributes and category.
     */
    public function fillProductSeo(array $data, ?Category $category = null): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        $sku = trim((string) ($data['sku'] ?? ''));
        $brand = trim((string) ($data['brand'] ?? 'Axiom'));
        $specSummary = trim((string) ($data['spec_summary'] ?? ''));
        $description = trim(strip_tags((string) ($data['description'] ?? '')));
        $categoryName = $category?->name ?? '';

        if (blank($data['meta_title'] ?? null) && $name !== '') {
            $baseTitle = $sku !== '' ? "{$name} ({$sku})" : $name;
            if ($brand !== '' && !Str::contains(Str::lower($baseTitle), Str::lower($brand))) {
                $baseTitle .= " - {$brand}";
            }
            $data['meta_title'] = Str::limit($baseTitle, 70, '');
        }

        if (blank($data['meta_description'] ?? null) && $name !== '') {
            $parts = [$name];
            if ($sku !== '') {
                $parts[] = "Mã {$sku}";
            }
            if ($specSummary !== '') {
                $parts[] = $specSummary;
            } elseif ($description !== '') {
                $parts[] = Str::limit($description, 95, '...');
            }
            $parts[] = "Chính hãng {$brand}, đầy đủ CO/CQ, báo giá nhanh B2B.";
            $data['meta_description'] = Str::limit(implode(' - ', $parts), 160, '...');
        }

        if (blank($data['meta_keywords'] ?? null) && $name !== '') {
            $keywords = array_filter([
                $name,
                $sku,
                $brand,
                $categoryName,
                'thiết bị công nghiệp',
                'vật tư cơ khí chính hãng',
            ], fn ($item) => trim((string) $item) !== '');

            $data['meta_keywords'] = Str::limit(implode(', ', array_unique($keywords)), 480, '');
        }

        return $data;
    }

    /**
     * Fill missing SEO fields for a category payload.
     */
    public function fillCategorySeo(array $data): array
    {
        $name = trim((string) ($data['name'] ?? ''));
        $subtitle = trim((string) ($data['subtitle'] ?? ''));
        $description = trim(strip_tags((string) ($data['description'] ?? '')));

        if (blank($data['meta_title'] ?? null) && $name !== '') {
            $title = $subtitle !== ''
                ? "{$name} - {$subtitle}"
                : "{$name} Công Nghiệp Chính Hãng";
            $data['meta_title'] = Str::limit($title, 70, '');
        }

        if (blank($data['meta_description'] ?? null) && $name !== '') {
            $desc = $description !== ''
                ? Str::limit($description, 115, '...') . ' Đầy đủ CO/CQ, báo giá B2B nhanh.'
                : "Danh mục {$name} công nghiệp chính hãng tại AXIOM. Kho hàng sẵn có, đầy đủ chứng từ CO/CQ, hỗ trợ báo giá kỹ thuật nhanh cho doanh nghiệp.";
            $data['meta_description'] = Str::limit($desc, 160, '...');
        }

        if (blank($data['meta_keywords'] ?? null) && $name !== '') {
            $keywords = array_filter([
                $name,
                $subtitle,
                'thiết bị công nghiệp',
                'vật tư công nghiệp',
                'AXIOM',
            ], fn ($item) => trim((string) $item) !== '');

            $data['meta_keywords'] = Str::limit(implode(', ', array_unique($keywords)), 480, '');
        }

        return $data;
    }
}

<?php

namespace App\Services;

use App\Models\SiteSetting;
use DomainException;
use Illuminate\Support\Facades\Cache;

class SiteSettingService
{
    private const CACHE_KEY = 'site_settings.all';

    /**
     * Default values mirror the content previously hardcoded on the public site.
     */
    public const DEFAULTS = [
        'company' => [
            'name'            => 'AXIOM Industrial Supply',
            'tagline'         => 'Đối tác kỹ thuật cung ứng thiết bị công nghiệp nặng, máy CNC và dụng cụ cơ khí chính xác cho các nhà máy sản xuất cơ khí, ô tô, điện tử và hàng không tại Việt Nam.',
            'hotline_display' => '0988.123.456',
            'hotline_tel'     => '0988123456',
            'hotline_note'    => '24/7',
            'email'           => 'sales@axiom.vn',
            'address'         => 'Lô E2, Khu Công Nghiệp Tân Bình, TP. Hồ Chí Minh',
            'zalo_url'        => 'https://zalo.me',
            'zalo_label'      => 'Axiom Supply',
            'copyright'       => '© 2026 AXIOM Industrial Supply. Tất cả các quyền được bảo lưu.',
            'footer_badge'    => 'ISO 9001 • Chứng Nhận CO/CQ Chính Hãng',
        ],
        'hero' => [
            'eyebrow'       => 'CUNG ỨNG THIẾT BỊ CHO DÂY CHUYỀN SẢN XUẤT CÔNG NGHIỆP',
            'title'         => 'Nhà Cung Cấp Máy Móc Công Nghiệp & Dụng Cụ Cơ Khí Chính Xác',
            'subtitle'      => 'Duy trì sản xuất liên tục. Cung cấp máy móc tin cậy, dụng cụ chính xác và phụ tùng thay thế từ một đối tác kỹ thuật duy nhất.',
            'badges'        => [
                ['icon' => 'shield-check', 'text' => 'Chứng Nhận CO/CQ'],
                ['icon' => 'package-check', 'text' => 'Hàng Có Sẵn Trong Kho'],
            ],
            'audience_note' => 'Dành cho bộ phận mua hàng, xưởng cơ khí & nhà máy sản xuất.',
            'image_url'     => '/assets/images/cnc-machinery.png',
            'caption_left'  => 'GIA CÔNG • DỤNG CỤ • ĐO LƯỜNG',
            'caption_right' => 'ISO 9001 / CO-CQ',
            'slides'        => [
                [
                    'image_url'     => '/assets/images/cnc-machinery.png',
                    'caption_left'  => 'GIA CÔNG • DỤNG CỤ • ĐO LƯỜNG',
                    'caption_right' => 'ISO 9001 / CO-CQ',
                ],
                [
                    'image_url'     => '/assets/images/cat-cnc.png',
                    'caption_left'  => 'MÁY CNC & MÁY CÔNG CỤ CHÍNH XÁC',
                    'caption_right' => 'KHO SẴN HÀNG',
                ],
                [
                    'image_url'     => '/assets/images/warehouse.png',
                    'caption_left'  => 'KHO VẬN CÔNG NGHIỆP AXIOM',
                    'caption_right' => 'GIAO HÀNG 24-48H',
                ],
            ],
        ],
        'trust_stats' => [
            'items' => [
                ['icon' => 'factory', 'value' => '10+', 'label' => 'Năm Kinh Nghiệm'],
                ['icon' => 'boxes', 'value' => '1.000+', 'label' => 'SKU Có Sẵn'],
                ['icon' => 'check-circle', 'value' => '100%', 'label' => 'CO/CQ Chính Hãng'],
                ['icon' => 'truck', 'value' => '24-48h', 'label' => 'Giao Hàng Toàn Quốc'],
            ],
        ],
        'capabilities' => [
            'eyebrow'       => '03 / KHO HÀNG & NĂNG LỰC CUNG ỨNG',
            'title'         => 'Hơn cả cung ứng. Một đối tác kỹ thuật.',
            'description'   => 'Từ việc khớp thông số kỹ thuật đến hỗ trợ lắp đặt ban đầu, chúng tôi giúp bộ phận mua hàng và kỹ thuật của bạn phối hợp nhịp nhàng.',
            'image_url'     => '/assets/images/warehouse.png',
            'image_caption' => 'Kho hàng được tổ chức khoa học. Sẵn sàng xuất kho.',
            'items'         => [
                ['icon' => 'clipboard-check', 'title' => 'Hỗ trợ kỹ thuật khi bàn giao', 'desc' => 'Kiểm tra ứng dụng, hướng dẫn lắp đặt và tài liệu kèm theo khi bàn giao.'],
                ['icon' => 'shield-check', 'title' => 'Chính sách bảo hành minh bạch', 'desc' => 'Điều khoản bằng văn bản cho từng sản phẩm, có đầu mối hỗ trợ sau bán hàng.'],
                ['icon' => 'truck', 'title' => 'Giao Hàng Theo Lịch Sản Xuất Của Bạn', 'desc' => 'Xác nhận tồn kho, đóng gói cẩn thận và phối hợp giao hàng theo yêu cầu.'],
            ],
        ],
        'product_detail' => [
            'discount_note'        => 'Chiết khấu 5% - 15% cho đơn hàng dự án & số lượng lớn',
            'vat_note'             => 'VAT 8% - 10% đầy đủ',
            'invoice_note'         => 'Hóa đơn điện tử xuất trong ngày',
            'guarantees'           => [
                'Bảo hành chính hãng 12-24T',
                'Đổi trả nếu sai dung sai',
                'Kỹ sư hỗ trợ lắp đặt / test',
            ],
            'highlights'           => [
                'Dung sai đồng đều, gia công chính xác theo chuẩn ISO.',
                'Độ cứng bề mặt vượt trội, kéo dài tuổi thọ sử dụng.',
                'Tương thích chuẩn công nghiệp quốc tế (JIS, DIN, ANSI).',
                'Kháng rung động và tản nhiệt tối ưu trong ca vận hành liên tục.',
            ],
            'packaging'            => [
                'Hộp bảo vệ chống ẩm, chống sốc và chống gỉ sét VCI.',
                'Kèm tem mã vạch truy xuất nguồn gốc SKU chính hãng.',
                'Chứng thư kiểm định (Inspection Certificate) kèm theo hộp.',
                'Tài liệu hướng dẫn vận hành và bảo trì máy.',
            ],
            'default_certificates' => [
                'CO/CQ Gốc Nhà Sản Xuất',
                'Chứng Nhận Chất Lượng Xuất Xưởng ISO 9001:2015',
                'Kiểm Định Dung Sai KCS AXIOM',
            ],
        ],
    ];

    /**
     * @return array<string>
     */
    public static function groups(): array
    {
        return array_keys(self::DEFAULTS);
    }

    /**
     * Get every settings group, merged over defaults (cached).
     */
    public function getAll(): array
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            $stored = SiteSetting::query()->pluck('value', 'key')->all();
            $result = [];

            foreach (self::DEFAULTS as $group => $defaults) {
                $value = $stored[$group] ?? null;
                $result[$group] = is_array($value) ? array_merge($defaults, $value) : $defaults;
            }

            return $result;
        });
    }

    /**
     * Get a single settings group.
     *
     * @throws DomainException
     */
    public function getGroup(string $group): array
    {
        $this->assertValidGroup($group);

        return $this->getAll()[$group];
    }

    /**
     * Replace the stored values of a settings group.
     *
     * @throws DomainException
     */
    public function updateGroup(string $group, array $data): array
    {
        $this->assertValidGroup($group);

        $allowedKeys = array_keys(self::DEFAULTS[$group]);
        $filtered = array_intersect_key($data, array_flip($allowedKeys));
        $merged = array_merge($this->getGroup($group), $filtered);

        if ($group === 'hero' && !empty($merged['slides']) && is_array($merged['slides'])) {
            $firstSlide = $merged['slides'][0];
            $merged['image_url'] = $firstSlide['image_url'] ?? $merged['image_url'];
            $merged['caption_left'] = $firstSlide['caption_left'] ?? $merged['caption_left'];
            $merged['caption_right'] = $firstSlide['caption_right'] ?? $merged['caption_right'];
        }

        SiteSetting::updateOrCreate(['key' => $group], ['value' => $merged]);
        Cache::forget(self::CACHE_KEY);

        return $merged;
    }

    /**
     * Seed default values for groups that do not exist yet.
     */
    public function seedDefaults(): void
    {
        foreach (self::DEFAULTS as $group => $defaults) {
            SiteSetting::firstOrCreate(['key' => $group], ['value' => $defaults]);
        }

        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @throws DomainException
     */
    private function assertValidGroup(string $group): void
    {
        if (!array_key_exists($group, self::DEFAULTS)) {
            throw new DomainException('Nhóm cài đặt không tồn tại.');
        }
    }
}

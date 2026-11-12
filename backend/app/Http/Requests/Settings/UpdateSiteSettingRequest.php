<?php

namespace App\Http\Requests\Settings;

use App\Http\Requests\BaseFormRequest;

class UpdateSiteSettingRequest extends BaseFormRequest
{
    protected function validationErrorMessage(): string
    {
        return 'Dữ liệu cài đặt không hợp lệ.';
    }

    public function rules(): array
    {
        $group = (string) $this->route('group');

        return match ($group) {
            'company' => [
                'name'            => 'required|string|max:150',
                'tagline'         => 'nullable|string|max:500',
                'hotline_display' => 'required|string|max:30',
                'hotline_tel'     => ['required', 'string', 'max:20', 'regex:/^[0-9+]+$/'],
                'hotline_note'    => 'nullable|string|max:30',
                'email'           => 'required|email|max:150',
                'address'         => 'required|string|max:255',
                'zalo_url'        => 'nullable|url|max:255',
                'zalo_label'      => 'nullable|string|max:60',
                'copyright'       => 'nullable|string|max:200',
                'footer_badge'    => 'nullable|string|max:120',
            ],
            'hero' => [
                'eyebrow'        => 'nullable|string|max:150',
                'title'          => 'required|string|max:200',
                'subtitle'       => 'nullable|string|max:500',
                'badges'         => 'present|array|max:4',
                'badges.*.icon'  => 'required|string|max:40',
                'badges.*.text'  => 'required|string|max:60',
                'audience_note'  => 'nullable|string|max:200',
                'image_url'      => 'nullable|string|max:500',
                'caption_left'   => 'nullable|string|max:80',
                'caption_right'  => 'nullable|string|max:80',
            ],
            'trust_stats' => [
                'items'         => 'required|array|min:1|max:4',
                'items.*.icon'  => 'required|string|max:40',
                'items.*.value' => 'required|string|max:20',
                'items.*.label' => 'required|string|max:60',
            ],
            'capabilities' => [
                'eyebrow'       => 'nullable|string|max:150',
                'title'         => 'required|string|max:200',
                'description'   => 'nullable|string|max:500',
                'image_url'     => 'nullable|string|max:500',
                'image_caption' => 'nullable|string|max:150',
                'items'         => 'present|array|max:6',
                'items.*.icon'  => 'required|string|max:40',
                'items.*.title' => 'required|string|max:120',
                'items.*.desc'  => 'nullable|string|max:300',
            ],
            'product_detail' => [
                'discount_note'          => 'nullable|string|max:200',
                'vat_note'               => 'nullable|string|max:100',
                'invoice_note'           => 'nullable|string|max:100',
                'guarantees'             => 'present|array|max:6',
                'guarantees.*'           => 'required|string|max:100',
                'highlights'             => 'present|array|max:10',
                'highlights.*'           => 'required|string|max:200',
                'packaging'              => 'present|array|max:10',
                'packaging.*'            => 'required|string|max:200',
                'default_certificates'   => 'present|array|max:10',
                'default_certificates.*' => 'required|string|max:200',
            ],
            default => [],
        };
    }

    public function messages(): array
    {
        return [
            'required'          => 'Trường :attribute là bắt buộc.',
            'max'               => 'Trường :attribute vượt quá giới hạn cho phép.',
            'min'               => 'Trường :attribute cần ít nhất :min mục.',
            'email'             => 'Email không đúng định dạng.',
            'url'               => 'Đường dẫn không hợp lệ.',
            'hotline_tel.regex' => 'Số điện thoại gọi chỉ gồm chữ số và dấu +.',
            'array'             => 'Trường :attribute phải là danh sách.',
            'present'           => 'Thiếu trường :attribute.',
        ];
    }
}

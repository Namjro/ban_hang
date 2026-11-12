<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class StoreCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
            'subtitle'             => 'nullable|string|max:120',
            'image_url'            => 'nullable|string|max:500',
            'highlights'           => 'nullable|array|max:2',
            'highlights.*.label'   => 'required|string|max:60',
            'highlights.*.value'   => 'required|string|max:200',
            'show_on_home'         => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'highlights.max'              => 'Tối đa 2 dòng nổi bật cho mỗi danh mục.',
            'highlights.*.label.required' => 'Vui lòng nhập nhãn cho dòng nổi bật.',
            'highlights.*.value.required' => 'Vui lòng nhập nội dung cho dòng nổi bật.',
        ];
    }
}

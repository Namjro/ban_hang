<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class AdminProductFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'search'              => 'nullable|string|max:255',
            'category_id'         => 'nullable|integer',
            'stock_status'        => 'nullable|string|in:in_stock,low_stock,pre_order',
            'show_on_home'        => 'nullable',
            'show_in_quick_specs' => 'nullable',
            'has_datasheet'       => 'nullable',
            'per_page'            => 'nullable|integer|min:1|max:100',
            'page'         => 'nullable|integer|min:1',
        ];
    }
}

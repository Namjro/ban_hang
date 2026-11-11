<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class AdminProductFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'search'       => 'nullable|string|max:255',
            'category_id'  => 'nullable|integer',
            'stock_status' => 'nullable|string|in:in_stock,low_stock,pre_order',
            'per_page'     => 'nullable|integer|min:1|max:100',
            'page'         => 'nullable|integer|min:1',
        ];
    }
}

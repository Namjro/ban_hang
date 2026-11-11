<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class ProductFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'search'       => 'nullable|string|max:255',
            'category'     => 'nullable|string|max:255',
            'brand'        => 'nullable|string|max:100',
            'stock_status' => 'nullable|string|in:in_stock,low_stock,pre_order',
            'featured'     => 'nullable',
            'sort_by'      => 'nullable|string|in:created_at,name,sku,id,price_display',
            'sort_order'   => 'nullable|string|in:asc,desc',
            'per_page'     => 'nullable|integer|min:1|max:100',
            'page'         => 'nullable|integer|min:1',
        ];
    }
}

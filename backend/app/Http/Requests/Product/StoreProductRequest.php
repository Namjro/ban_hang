<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class StoreProductRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'category_id'    => 'required|exists:categories,id',
            'sku'            => 'required|string|max:50|unique:products,sku',
            'name'           => 'required|string|max:255',
            'brand'          => 'nullable|string|max:100',
            'image_url'      => 'nullable|string|max:500',
            'images'         => 'nullable|array',
            'images.*'       => 'string|max:500',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|array',
            'stock_status'   => 'required|in:in_stock,low_stock,pre_order',
            'price_display'  => 'nullable|string|max:100',
            'has_cocq'       => 'boolean',
            'certificates'   => 'nullable|array',
            'certificates.*' => 'string|max:255',
            'is_featured'    => 'boolean',
        ];
    }
}

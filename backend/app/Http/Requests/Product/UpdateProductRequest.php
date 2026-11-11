<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class UpdateProductRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $id = $this->route('product') ?? $this->route('id');

        return [
            'category_id'    => 'sometimes|exists:categories,id',
            'sku'            => "sometimes|string|max:50|unique:products,sku,{$id}",
            'name'           => 'sometimes|string|max:255',
            'brand'          => 'nullable|string|max:100',
            'image_url'      => 'nullable|string|max:500',
            'images'         => 'nullable|array',
            'images.*'       => 'string|max:500',
            'description'    => 'nullable|string',
            'specifications' => 'nullable|array',
            'stock_status'   => 'sometimes|in:in_stock,low_stock,pre_order',
            'price_display'  => 'nullable|string|max:100',
            'has_cocq'       => 'boolean',
            'certificates'   => 'nullable|array',
            'certificates.*' => 'string|max:255',
            'is_featured'    => 'boolean',
        ];
    }
}

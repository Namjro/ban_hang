<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class UpdateCategoryRequest extends BaseFormRequest
{
    public function rules(): array
    {
        $id = $this->route('category') ?? $this->route('id');

        return [
            'name'        => 'sometimes|required|string|max:255',
            'slug'        => "sometimes|required|string|max:255|unique:categories,slug,{$id}",
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'order'       => 'nullable|integer',
        ];
    }
}

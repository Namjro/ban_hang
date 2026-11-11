<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class CategoryFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
        ];
    }
}

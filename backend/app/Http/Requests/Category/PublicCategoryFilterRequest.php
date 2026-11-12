<?php

namespace App\Http\Requests\Category;

use App\Http\Requests\BaseFormRequest;

class PublicCategoryFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'home' => 'nullable|boolean',
        ];
    }
}

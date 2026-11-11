<?php

namespace App\Http\Requests\Quote;

use App\Http\Requests\BaseFormRequest;

class QuoteFilterRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'status'   => 'nullable|string|in:new,contacted,quoted,completed,cancelled',
            'search'   => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page'     => 'nullable|integer|min:1',
        ];
    }
}

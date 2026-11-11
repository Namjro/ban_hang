<?php

namespace App\Http\Requests\Quote;

use App\Http\Requests\BaseFormRequest;

class UpdateQuoteStatusRequest extends BaseFormRequest
{
    public function rules(): array
    {
        return [
            'status'      => 'required|in:new,contacted,quoted,completed,cancelled',
            'admin_notes' => 'nullable|string',
        ];
    }
}

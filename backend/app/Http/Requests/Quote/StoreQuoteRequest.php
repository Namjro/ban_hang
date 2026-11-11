<?php

namespace App\Http\Requests\Quote;

use App\Http\Requests\BaseFormRequest;

class StoreQuoteRequest extends BaseFormRequest
{
    protected function validationErrorMessage(): string
    {
        return 'Vui lòng kiểm tra lại thông tin gửi yêu cầu.';
    }

    public function rules(): array
    {
        return [
            'full_name'           => 'required|string|max:255',
            'phone'               => 'required|string|max:50',
            'company_name'        => 'nullable|string|max:255',
            'email'               => 'nullable|email|max:255',
            'sku_target'          => 'nullable|string|max:255',
            'requirement_content' => 'nullable|string|max:2000',
            'source'              => 'nullable|string|in:landing_form,contact_modal',
        ];
    }
}

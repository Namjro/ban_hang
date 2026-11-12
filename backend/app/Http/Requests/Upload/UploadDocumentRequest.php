<?php

namespace App\Http\Requests\Upload;

use App\Http\Requests\BaseFormRequest;

class UploadDocumentRequest extends BaseFormRequest
{
    protected function validationErrorMessage(): string
    {
        return 'Tệp tài liệu tải lên không hợp lệ.';
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:pdf|max:10240',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Vui lòng chọn tệp PDF.',
            'file.mimes'    => 'Chỉ hỗ trợ tệp PDF.',
            'file.max'      => 'Tệp PDF tối đa 10MB.',
        ];
    }
}

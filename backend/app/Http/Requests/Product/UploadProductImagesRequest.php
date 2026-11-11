<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseFormRequest;

class UploadProductImagesRequest extends BaseFormRequest
{
    protected function validationErrorMessage(): string
    {
        return 'Không tìm thấy tệp ảnh tải lên hoặc tệp không hợp lệ.';
    }

    public function rules(): array
    {
        return [
            'images'   => 'nullable|array',
            'images.*' => 'file|mimes:jpg,jpeg,png,webp,gif,svg|max:10240',
            'image'    => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg|max:10240',
            'file'     => 'nullable|file|mimes:jpg,jpeg,png,webp,gif,svg|max:10240',
        ];
    }
}

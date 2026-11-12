<?php

namespace App\Http\Requests\Upload;

use App\Http\Requests\BaseFormRequest;

class UploadImagesRequest extends BaseFormRequest
{
    protected function validationErrorMessage(): string
    {
        return 'Tệp ảnh tải lên không hợp lệ.';
    }

    public function rules(): array
    {
        return [
            'images'   => 'required|array|min:1|max:10',
            'images.*' => 'file|mimes:jpg,jpeg,png,webp,gif,svg|max:10240',
            'folder'   => 'nullable|in:products,categories,site',
        ];
    }

    public function messages(): array
    {
        return [
            'images.required' => 'Vui lòng chọn ít nhất một ảnh.',
            'images.*.mimes'  => 'Chỉ hỗ trợ ảnh JPG, PNG, WEBP, GIF, SVG.',
            'images.*.max'    => 'Mỗi ảnh tối đa 10MB.',
            'folder.in'       => 'Thư mục lưu trữ không hợp lệ.',
        ];
    }
}

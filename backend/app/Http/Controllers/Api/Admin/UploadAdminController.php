<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Upload\UploadDocumentRequest;
use App\Http\Requests\Upload\UploadImagesRequest;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;

class UploadAdminController extends Controller
{
    public function __construct(
        protected MediaService $mediaService
    ) {}

    public function images(UploadImagesRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $urls = $this->mediaService->storeImages(
            $request->file('images', []),
            $request->getSchemeAndHttpHost(),
            $validated['folder'] ?? 'site'
        );

        if (empty($urls)) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lưu ảnh. Vui lòng thử lại với định dạng JPG, PNG, WEBP, GIF, SVG.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tải lên thành công ' . count($urls) . ' ảnh.',
            'data'    => $urls,
        ]);
    }

    public function document(UploadDocumentRequest $request): JsonResponse
    {
        $url = $this->mediaService->storeDocument($request->file('file'), $request->getSchemeAndHttpHost());

        if ($url === null) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể lưu tệp PDF. Vui lòng thử lại.',
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tải lên tài liệu thành công.',
            'data'    => ['url' => $url],
        ]);
    }
}

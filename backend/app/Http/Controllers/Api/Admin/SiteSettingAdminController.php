<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateSiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Services\SiteSettingService;
use DomainException;
use Illuminate\Http\JsonResponse;

class SiteSettingAdminController extends Controller
{
    public function __construct(
        protected SiteSettingService $siteSettingService
    ) {}

    public function show(string $group): JsonResponse
    {
        try {
            $data = $this->siteSettingService->getGroup($group);
        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => new SiteSettingResource($data),
        ]);
    }

    public function update(UpdateSiteSettingRequest $request, string $group): JsonResponse
    {
        try {
            $data = $this->siteSettingService->updateGroup($group, $request->validated());
        } catch (DomainException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Đã lưu cài đặt thành công.',
            'data'    => new SiteSettingResource($data),
        ]);
    }
}

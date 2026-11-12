<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Services\SiteSettingService;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function __construct(
        protected SiteSettingService $siteSettingService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => new SiteSettingResource($this->siteSettingService->getAll()),
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Services\SiteSettingService;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    public function __construct(
        protected SiteSettingService $siteSettingService
    ) {}

    public function run(): void
    {
        $this->siteSettingService->seedDefaults();
    }
}

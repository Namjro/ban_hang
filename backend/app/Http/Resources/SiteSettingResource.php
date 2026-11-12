<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Wraps a settings array (either all groups or a single group).
 */
class SiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return (array) $this->resource;
    }
}

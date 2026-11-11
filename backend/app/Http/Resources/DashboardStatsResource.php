<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'overview'      => $this->resource['overview'],
            'recent_quotes' => QuoteRequestResource::collection($this->resource['recent_quotes']),
        ];
    }
}

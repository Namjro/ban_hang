<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'full_name'           => $this->full_name,
            'company_name'        => $this->company_name,
            'phone'               => $this->phone,
            'email'               => $this->email,
            'sku_target'          => $this->sku_target,
            'requirement_content' => $this->requirement_content,
            'source'              => $this->source,
            'status'              => $this->status,
            'admin_notes'         => $this->admin_notes,
            'created_at'          => $this->created_at,
            'updated_at'          => $this->updated_at,
        ];
    }
}

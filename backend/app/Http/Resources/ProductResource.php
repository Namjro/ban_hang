<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'category_id'    => $this->category_id,
            'sku'            => $this->sku,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'brand'          => $this->brand,
            'image_url'      => $this->image_url,
            'images'         => $this->images,
            'description'    => $this->description,
            'specifications' => $this->specifications,
            'stock_status'   => $this->stock_status,
            'price_display'  => $this->price_display,
            'has_cocq'       => (bool) $this->has_cocq,
            'certificates'   => $this->certificates,
            'is_featured'    => (bool) $this->is_featured,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}

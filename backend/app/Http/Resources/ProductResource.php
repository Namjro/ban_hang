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
            'is_featured'         => (bool) $this->is_featured,
            'show_on_home'        => (bool) $this->show_on_home,
            'home_order'          => (int) ($this->home_order ?? 0),
            'spec_summary'        => $this->spec_summary,
            'show_in_quick_specs' => (bool) $this->show_in_quick_specs,
            'quick_spec_order'    => (int) $this->quick_spec_order,
            'datasheet_url'       => $this->datasheet_url,
            'highlights'          => $this->highlights,
            'packaging'           => $this->packaging,
            'meta_title'          => $this->meta_title,
            'meta_description'    => $this->meta_description,
            'meta_keywords'       => $this->meta_keywords,
            'category'       => new CategoryResource($this->whenLoaded('category')),
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}

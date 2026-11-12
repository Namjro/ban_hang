<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'name'           => $this->name,
            'slug'           => $this->slug,
            'description'    => $this->description,
            'icon'           => $this->icon,
            'order'          => $this->order,
            'subtitle'       => $this->subtitle,
            'image_url'      => $this->image_url,
            'highlights'     => $this->highlights ?? [],
            'show_on_home'   => (bool) ($this->show_on_home ?? true),
            'meta_title'       => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords'    => $this->meta_keywords,
            'products_count' => $this->when(isset($this->products_count), $this->products_count),
            'products'       => ProductResource::collection($this->whenLoaded('products')),
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}

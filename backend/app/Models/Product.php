<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'sku',
        'name',
        'slug',
        'brand',
        'image_url',
        'images',
        'description',
        'specifications',
        'stock_status',
        'price_display',
        'has_cocq',
        'certificates',
        'is_featured',
        'spec_summary',
        'show_in_quick_specs',
        'quick_spec_order',
        'datasheet_url',
        'highlights',
        'packaging',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'images' => 'array',
        'specifications' => 'array',
        'certificates' => 'array',
        'highlights' => 'array',
        'packaging' => 'array',
        'has_cocq' => 'boolean',
        'is_featured' => 'boolean',
        'show_in_quick_specs' => 'boolean',
        'quick_spec_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

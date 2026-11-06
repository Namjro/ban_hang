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
    ];

    protected $casts = [
        'images' => 'array',
        'specifications' => 'array',
        'certificates' => 'array',
        'has_cocq' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}

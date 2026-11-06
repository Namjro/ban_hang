<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'company_name',
        'phone',
        'email',
        'sku_target',
        'requirement_content',
        'source',
        'status',
        'admin_notes',
    ];
}

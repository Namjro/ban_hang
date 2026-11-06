<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('brand')->default('Axiom');
            $table->string('image_url')->nullable();
            $table->text('description')->nullable();
            $table->json('specifications')->nullable();
            $table->string('stock_status')->default('in_stock'); // in_stock, low_stock, pre_order
            $table->string('price_display')->default('Liên hệ báo giá');
            $table->boolean('has_cocq')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

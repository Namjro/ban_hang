<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('subtitle')->nullable()->after('name');
            $table->string('image_url', 500)->nullable()->after('icon');
            $table->json('highlights')->nullable()->after('image_url');
            $table->boolean('show_on_home')->default(true)->after('highlights');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['subtitle', 'image_url', 'highlights', 'show_on_home']);
        });
    }
};

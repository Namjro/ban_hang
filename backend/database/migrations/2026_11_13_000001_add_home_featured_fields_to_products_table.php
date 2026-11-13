<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('show_on_home')->default(false)->after('is_featured')->index();
            $table->unsignedInteger('home_order')->default(0)->after('show_on_home');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['show_on_home']);
            $table->dropColumn(['show_on_home', 'home_order']);
        });
    }
};

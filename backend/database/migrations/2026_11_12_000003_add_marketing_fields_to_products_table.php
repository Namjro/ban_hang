<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('spec_summary')->nullable()->after('specifications');
            $table->boolean('show_in_quick_specs')->default(false)->after('is_featured');
            $table->unsignedInteger('quick_spec_order')->default(0)->after('show_in_quick_specs');
            $table->string('datasheet_url', 500)->nullable()->after('certificates');
            $table->json('highlights')->nullable()->after('datasheet_url');
            $table->json('packaging')->nullable()->after('highlights');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'spec_summary',
                'show_in_quick_specs',
                'quick_spec_order',
                'datasheet_url',
                'highlights',
                'packaging',
            ]);
        });
    }
};

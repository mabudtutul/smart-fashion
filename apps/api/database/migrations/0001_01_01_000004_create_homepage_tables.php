<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_slides', function (Blueprint $table) {
            $table->string('id', 15)->primary();
            $table->string('title')->default('');
            $table->string('subtitle')->default('');
            $table->string('button_text')->default('');
            $table->string('button_url')->default('');
            $table->string('image_desktop_path')->nullable();
            $table->string('image_mobile_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('homepage_banners', function (Blueprint $table) {
            $table->string('id', 15)->primary();
            $table->string('title')->default('');
            $table->string('subtitle')->default('');
            $table->string('button_text')->default('');
            $table->string('button_url')->default('');
            $table->string('placement', 32)->default('promo_row');
            $table->string('image_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        if (Schema::hasTable('categories') && ! Schema::hasColumn('categories', 'sort_order')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->unsignedInteger('sort_order')->default(0)->after('image_path');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('homepage_banners');
        Schema::dropIfExists('hero_slides');

        if (Schema::hasTable('categories') && Schema::hasColumn('categories', 'sort_order')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropColumn('sort_order');
            });
        }
    }
};

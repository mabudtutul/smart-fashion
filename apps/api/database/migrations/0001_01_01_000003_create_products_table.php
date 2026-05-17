<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('id', 15)->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('category');
            $table->string('image_path')->nullable();
            $table->decimal('rating', 3, 1)->nullable();
            $table->unsignedInteger('stock')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('bestseller')->default(false);
            $table->boolean('is_new')->default(false);
            $table->unsignedTinyInteger('discount')->nullable();
            $table->timestamps();

            $table->index('category');
            $table->index('featured');
            $table->index('bestseller');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

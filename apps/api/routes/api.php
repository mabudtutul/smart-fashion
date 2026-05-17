<?php

use App\Http\Controllers\Api\V1\Admin\CategoryCatalogController;
use App\Http\Controllers\Api\V1\Admin\CategoryImageController;
use App\Http\Controllers\Api\V1\Admin\CategorySyncController;
use App\Http\Controllers\Api\V1\Admin\ProductCatalogController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController;
use App\Http\Controllers\Api\V1\Admin\ProductSyncController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    Route::prefix('auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    Route::prefix('admin')->group(function (): void {
        Route::get('products', [ProductCatalogController::class, 'index']);
        Route::get('products/{product}', [ProductCatalogController::class, 'show']);
        Route::get('categories', [CategoryCatalogController::class, 'index']);
        Route::get('categories/{category}', [CategoryCatalogController::class, 'show']);

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('products', [ProductCatalogController::class, 'store']);
            Route::put('products/{product}', [ProductCatalogController::class, 'update']);
            Route::delete('products/{product}', [ProductCatalogController::class, 'destroy']);
            Route::post('categories', [CategoryCatalogController::class, 'store']);
            Route::put('categories/{category}', [CategoryCatalogController::class, 'update']);
            Route::delete('categories/{category}', [CategoryCatalogController::class, 'destroy']);

            /** @deprecated PB dual-write bridge — omit when VITE_ADMIN_CATALOG_DRIVER=laravel */
            Route::put('products/{product}/sync', [ProductSyncController::class, 'upsert']);
            Route::put('categories/{category}/sync', [CategorySyncController::class, 'upsert']);

            Route::post('products/{product}/image', [ProductImageController::class, 'store']);
            Route::post('categories/{category}/image', [CategoryImageController::class, 'store']);
        });
    });
});

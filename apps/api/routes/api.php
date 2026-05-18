<?php

use App\Http\Controllers\Api\V1\Admin\CategoryCatalogController;
use App\Http\Controllers\Api\V1\Admin\CategoryImageController;
use App\Http\Controllers\Api\V1\Admin\CategorySyncController;
use App\Http\Controllers\Api\V1\Admin\HeroSlideCatalogController;
use App\Http\Controllers\Api\V1\Admin\HeroSlideImageController;
use App\Http\Controllers\Api\V1\Admin\HomepageBannerCatalogController;
use App\Http\Controllers\Api\V1\Admin\HomepageBannerImageController;
use App\Http\Controllers\Api\V1\Admin\MediaHealthController;
use App\Http\Controllers\Api\V1\Admin\ProductCatalogController;
use App\Http\Controllers\Api\V1\Admin\ProductImageController;
use App\Http\Controllers\Api\V1\Admin\ProductSyncController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\HomepageController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('homepage', [HomepageController::class, 'show']);

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    Route::prefix('auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    Route::prefix('admin')->middleware('auth:sanctum')->group(function (): void {
        Route::get('media/health', [MediaHealthController::class, 'show']);

        Route::get('products', [ProductCatalogController::class, 'index']);
        Route::get('products/{product}', [ProductCatalogController::class, 'show']);
        Route::get('categories', [CategoryCatalogController::class, 'index']);
        Route::get('categories/{category}', [CategoryCatalogController::class, 'show']);

        Route::post('products', [ProductCatalogController::class, 'store']);
        Route::put('products/{product}', [ProductCatalogController::class, 'update']);
        Route::delete('products/{product}', [ProductCatalogController::class, 'destroy']);
        Route::post('categories', [CategoryCatalogController::class, 'store']);
        Route::put('categories/{category}', [CategoryCatalogController::class, 'update']);
        Route::delete('categories/{category}', [CategoryCatalogController::class, 'destroy']);

        Route::get('hero-slides', [HeroSlideCatalogController::class, 'index']);
        Route::get('hero-slides/{hero_slide}', [HeroSlideCatalogController::class, 'show']);
        Route::post('hero-slides', [HeroSlideCatalogController::class, 'store']);
        Route::put('hero-slides/{hero_slide}', [HeroSlideCatalogController::class, 'update']);
        Route::delete('hero-slides/{hero_slide}', [HeroSlideCatalogController::class, 'destroy']);
        Route::post('hero-slides/{hero_slide}/image', [HeroSlideImageController::class, 'store']);

        Route::get('homepage-banners', [HomepageBannerCatalogController::class, 'index']);
        Route::get('homepage-banners/{homepage_banner}', [HomepageBannerCatalogController::class, 'show']);
        Route::post('homepage-banners', [HomepageBannerCatalogController::class, 'store']);
        Route::put('homepage-banners/{homepage_banner}', [HomepageBannerCatalogController::class, 'update']);
        Route::delete('homepage-banners/{homepage_banner}', [HomepageBannerCatalogController::class, 'destroy']);
        Route::post('homepage-banners/{homepage_banner}/image', [HomepageBannerImageController::class, 'store']);

        /** @deprecated PB dual-write bridge */
        Route::put('products/{product}/sync', [ProductSyncController::class, 'upsert']);
        Route::put('categories/{category}/sync', [CategorySyncController::class, 'upsert']);

        Route::post('products/{product}/image', [ProductImageController::class, 'store']);
        Route::delete('products/{product}/image', [ProductImageController::class, 'destroy']);
        Route::post('categories/{category}/image', [CategoryImageController::class, 'store']);
        Route::delete('categories/{category}/image', [CategoryImageController::class, 'destroy']);
    });
});

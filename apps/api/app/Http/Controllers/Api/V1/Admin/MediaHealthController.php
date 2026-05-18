<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Support\PublicUploadUrl;
use App\Support\UploadsPath;
use Illuminate\Http\JsonResponse;

class MediaHealthController extends Controller
{
    public function show(): JsonResponse
    {
        $root = UploadsPath::root();
        $writable = is_dir($root) && is_writable($root);

        $sampleProduct = Product::query()
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->first();

        $sampleCategory = Category::query()
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->first();

        $productUrl = $sampleProduct
            ? PublicUploadUrl::fromPath($sampleProduct->image_path)
            : null;

        $categoryUrl = $sampleCategory
            ? PublicUploadUrl::fromPath($sampleCategory->image_path)
            : null;

        return response()->json([
            'uploads_root' => $root,
            'uploads_root_exists' => is_dir($root),
            'uploads_root_writable' => $writable,
            'app_url' => config('app.url'),
            'uploads_base_url' => PublicUploadUrl::base(),
            'products_with_image_path' => Product::query()
                ->whereNotNull('image_path')
                ->where('image_path', '!=', '')
                ->count(),
            'categories_with_image_path' => Category::query()
                ->whereNotNull('image_path')
                ->where('image_path', '!=', '')
                ->count(),
            'sample_product' => $sampleProduct ? [
                'id' => $sampleProduct->id,
                'image_path' => $sampleProduct->image_path,
                'image_url' => $productUrl,
                'file_exists' => UploadsPath::exists($sampleProduct->image_path),
            ] : null,
            'sample_category' => $sampleCategory ? [
                'id' => $sampleCategory->id,
                'image_path' => $sampleCategory->image_path,
                'image_url' => $categoryUrl,
                'file_exists' => UploadsPath::exists($sampleCategory->image_path),
            ] : null,
        ]);
    }
}

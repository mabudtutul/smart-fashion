<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogImageRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\Media\CatalogImageProcessor;
use App\Support\PublicUploadUrl;

class ProductImageController extends Controller
{
    public function store(
        StoreCatalogImageRequest $request,
        Product $product,
        CatalogImageProcessor $processor,
    ) {
        $variants = $processor->processProduct($request->file('image'), $product->id);

        $product->image_path = $variants['main'] ?? reset($variants);
        $product->save();

        return response()->json([
            'record' => new ProductResource($product->fresh()),
            'image_urls' => PublicUploadUrl::productVariants($product->id, $product->image_path),
        ]);
    }
}

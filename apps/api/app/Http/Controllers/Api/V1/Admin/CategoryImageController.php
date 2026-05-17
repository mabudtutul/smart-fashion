<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogImageRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\Media\CatalogImageProcessor;
use App\Support\PublicUploadUrl;

class CategoryImageController extends Controller
{
    public function store(
        StoreCatalogImageRequest $request,
        Category $category,
        CatalogImageProcessor $processor,
    ) {
        $variants = $processor->processCategory($request->file('image'), $category->id);

        $category->image_path = $variants['banner'] ?? reset($variants);
        $category->save();

        return response()->json([
            'record' => new CategoryResource($category->fresh()),
            'image_urls' => PublicUploadUrl::categoryVariants($category->id, $category->image_path),
        ]);
    }
}

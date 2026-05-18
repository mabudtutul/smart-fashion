<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogImageRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\Media\CatalogImageProcessor;
use App\Support\PublicUploadUrl;
use App\Support\UploadsPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CategoryImageController extends Controller
{
    use HandlesAdminIdempotency;

    public function store(
        StoreCatalogImageRequest $request,
        Category $category,
        CatalogImageProcessor $processor,
    ): JsonResponse {
        $action = 'admin.categories.image.'.$category->id;

        return $this->idempotentJson($request, $action, function () use ($request, $category, $processor) {
            return DB::transaction(function () use ($request, $category, $processor) {
            $variants = $processor->processCategory($request->file('image'), $category->id);

            $imagePath = $variants['banner'] ?? reset($variants);
            if (! is_string($imagePath) || $imagePath === '') {
                throw ValidationException::withMessages([
                    'image' => ['Image variants were not generated.'],
                ]);
            }

            if (! UploadsPath::exists($imagePath)) {
                throw ValidationException::withMessages([
                    'image' => ['Image was processed but could not be verified on disk. Check UPLOADS_ROOT.'],
                ]);
            }

            $category->image_path = $imagePath;
            $category->save();

            $fresh = $category->fresh();

            return response()->json([
                'record' => new CategoryResource($fresh),
                'image_path' => $fresh->image_path,
                'image_urls' => PublicUploadUrl::categoryVariants($fresh->id, $fresh->image_path),
            ]);
            });
        });
    }

    public function destroy(Category $category): JsonResponse
    {
        return DB::transaction(function () use ($category) {
            UploadsPath::deleteRelativeDirectory("categories/{$category->id}");
            $category->image_path = null;
            $category->save();

            $fresh = $category->fresh();

            return response()->json([
                'record' => new CategoryResource($fresh),
                'image_path' => null,
                'image_urls' => null,
            ]);
        });
    }
}

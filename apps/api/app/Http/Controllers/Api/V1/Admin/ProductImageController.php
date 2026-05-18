<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCatalogImageRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\Media\CatalogImageProcessor;
use App\Support\PublicUploadUrl;
use App\Support\UploadsPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ProductImageController extends Controller
{
    use HandlesAdminIdempotency;

    public function store(
        StoreCatalogImageRequest $request,
        Product $product,
        CatalogImageProcessor $processor,
    ): JsonResponse {
        $action = 'admin.products.image.'.$product->id;

        return $this->idempotentJson($request, $action, function () use ($request, $product, $processor) {
            return DB::transaction(function () use ($request, $product, $processor) {
            $variants = $processor->processProduct($request->file('image'), $product->id);

            $imagePath = $variants['main'] ?? reset($variants);
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

            $product->image_path = $imagePath;
            $product->save();

            $fresh = $product->fresh();

            return response()->json([
                'record' => new ProductResource($fresh),
                'image_path' => $fresh->image_path,
                'image_urls' => PublicUploadUrl::productVariants($fresh->id, $fresh->image_path),
            ]);
            });
        });
    }

    public function destroy(Product $product): JsonResponse
    {
        return DB::transaction(function () use ($product) {
            UploadsPath::deleteRelativeDirectory("products/{$product->id}");
            $product->image_path = null;
            $product->save();

            $fresh = $product->fresh();

            return response()->json([
                'record' => new ProductResource($fresh),
                'image_path' => null,
                'image_urls' => null,
            ]);
        });
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductCatalogRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCatalogController extends Controller
{
    use HandlesAdminIdempotency;

    public function index(Request $request): JsonResponse
    {
        return app(ProductController::class)->index($request);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(new ProductResource($product));
    }

    public function store(ProductCatalogRequest $request): JsonResponse
    {
        return $this->idempotentJson($request, 'admin.products.store', function () use ($request) {
            $product = Product::query()->create($request->catalogAttributes());

            return response()->json(new ProductResource($product), 201);
        });
    }

    public function update(ProductCatalogRequest $request, Product $product): JsonResponse
    {
        $product->fill($request->catalogAttributes());
        $product->save();

        return response()->json(new ProductResource($product->fresh()));
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['id' => $product->id, 'deleted' => true]);
    }
}

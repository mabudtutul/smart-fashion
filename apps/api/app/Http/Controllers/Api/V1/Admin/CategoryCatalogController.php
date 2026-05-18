<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryCatalogRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryCatalogController extends Controller
{
    use HandlesAdminIdempotency;

    public function index(Request $request): JsonResponse
    {
        return app(CategoryController::class)->index($request);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(new CategoryResource($category));
    }

    public function store(CategoryCatalogRequest $request): JsonResponse
    {
        return $this->idempotentJson($request, 'admin.categories.store', function () use ($request) {
            $category = Category::query()->create($request->catalogAttributes());

            return response()->json(new CategoryResource($category), 201);
        });
    }

    public function update(CategoryCatalogRequest $request, Category $category): JsonResponse
    {
        $previousName = $category->name;
        $category->fill($request->catalogAttributes());
        $category->save();

        if ($previousName !== $category->name) {
            Product::query()
                ->where('category', $previousName)
                ->update(['category' => $category->name]);
        }

        return response()->json(new CategoryResource($category->fresh()));
    }

    public function destroy(Category $category): JsonResponse
    {
        $productCount = Product::query()->where('category', $category->name)->count();
        if ($productCount > 0) {
            return response()->json([
                'message' => 'Cannot delete a category that still has products.',
            ], 422);
        }

        $category->delete();

        return response()->json(['id' => $category->id, 'deleted' => true]);
    }
}

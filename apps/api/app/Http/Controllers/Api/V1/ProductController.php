<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Support\PocketBasePaginator;
use App\Support\ProductFilterParser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', $request->query('per_page', 30)), 100);
        $page = max((int) $request->query('page', 1), 1);

        $query = Product::query();
        ProductFilterParser::apply($query, $request->query('filter'), $request->query());
        ProductFilterParser::applySort($query, $request->query('sort', '-created'));

        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        return PocketBasePaginator::response(
            $paginator,
            ProductResource::collection($paginator->getCollection())
        );
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(new ProductResource($product));
    }
}

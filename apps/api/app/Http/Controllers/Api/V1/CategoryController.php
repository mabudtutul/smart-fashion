<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\PocketBasePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', $request->query('per_page', 30)), 100);
        $page = max((int) $request->query('page', 1), 1);

        $sort = $request->query('sort', 'sort_order');
        $direction = str_starts_with((string) $sort, '-') ? 'desc' : 'asc';
        $field = ltrim((string) $sort, '-');
        $column = match ($field) {
            'name' => 'name',
            'created' => 'created_at',
            default => 'sort_order',
        };

        $paginator = Category::query()
            ->orderBy($column, $direction)
            ->orderBy('name')
            ->paginate($perPage, ['*'], 'page', $page);

        return PocketBasePaginator::response(
            $paginator,
            CategoryResource::collection($paginator->getCollection())
        );
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json(new CategoryResource($category));
    }
}

<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;

final class PocketBasePaginator
{
    public static function response(LengthAwarePaginator $paginator, ResourceCollection $collection): JsonResponse
    {
        return response()->json([
            'page' => $paginator->currentPage(),
            'perPage' => $paginator->perPage(),
            'totalItems' => $paginator->total(),
            'totalPages' => $paginator->lastPage(),
            'items' => $collection->resolve(),
        ]);
    }
}

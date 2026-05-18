<?php

namespace App\Http\Controllers\Concerns;

use App\Support\AdminIdempotency;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

trait HandlesAdminIdempotency
{
    protected function idempotentJson(Request $request, string $action, callable $factory): JsonResponse
    {
        $userId = $request->user()?->id;
        $cacheKey = AdminIdempotency::cacheKey($userId, $action, $request->header('Idempotency-Key'));

        if ($cacheKey !== null && ($replay = AdminIdempotency::replay($cacheKey)) !== null) {
            return $replay;
        }

        $response = $factory();
        if ($cacheKey !== null) {
            AdminIdempotency::remember($cacheKey, $response);
        }

        return $response;
    }
}

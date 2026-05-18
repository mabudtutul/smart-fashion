<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

/**
 * Prevents duplicate admin POST creates from double-submit / network retries.
 * Client sends Idempotency-Key (UUID per form session).
 */
final class AdminIdempotency
{
    private const TTL_MINUTES = 15;

    public static function cacheKey(?int $userId, string $action, ?string $idempotencyKey): ?string
    {
        if ($userId === null || $idempotencyKey === null || $idempotencyKey === '') {
            return null;
        }

        $normalized = preg_replace('/[^a-zA-Z0-9._-]/', '', $idempotencyKey) ?? '';

        if (strlen($normalized) < 8 || strlen($normalized) > 128) {
            return null;
        }

        return 'admin_idem:'.$userId.':'.$action.':'.$normalized;
    }

    public static function replay(?string $cacheKey): ?JsonResponse
    {
        if ($cacheKey === null) {
            return null;
        }

        $cached = Cache::get($cacheKey);
        if (! is_array($cached) || ! isset($cached['status'], $cached['body'])) {
            return null;
        }

        return response()->json($cached['body'], (int) $cached['status']);
    }

    public static function remember(?string $cacheKey, JsonResponse $response): void
    {
        if ($cacheKey === null) {
            return;
        }

        $body = json_decode($response->getContent(), true);
        if (! is_array($body)) {
            return;
        }

        Cache::put($cacheKey, [
            'status' => $response->getStatusCode(),
            'body' => $body,
        ], now()->addMinutes(self::TTL_MINUTES));
    }
}

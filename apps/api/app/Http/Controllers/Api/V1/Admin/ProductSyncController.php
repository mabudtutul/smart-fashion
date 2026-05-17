<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Mirror PocketBase catalog rows into Laravel (media pipeline only).
 */
class ProductSyncController extends Controller
{
    public function upsert(Request $request, string $product): JsonResponse
    {
        if (! preg_match('/^[a-z0-9]{15}$/', $product)) {
            return response()->json(['message' => 'Invalid product id.'], 422);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['required', 'string', 'max:255'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'featured' => ['sometimes', 'boolean'],
            'bestseller' => ['sometimes', 'boolean'],
            'new' => ['sometimes', 'boolean'],
        ]);

        $record = Product::query()->updateOrCreate(
            ['id' => $product],
            [
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'price' => $data['price'],
                'category' => $data['category'],
                'stock' => $data['stock'] ?? null,
                'discount' => $data['discount'] ?? null,
                'featured' => (bool) ($data['featured'] ?? false),
                'bestseller' => (bool) ($data['bestseller'] ?? false),
                'is_new' => (bool) ($data['new'] ?? false),
            ]
        );

        return response()->json(['id' => $record->id, 'synced' => true]);
    }
}

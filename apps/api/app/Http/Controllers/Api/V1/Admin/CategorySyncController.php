<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorySyncController extends Controller
{
    public function upsert(Request $request, string $category): JsonResponse
    {
        if (! preg_match('/^[a-z0-9]{15}$/', $category)) {
            return response()->json(['message' => 'Invalid category id.'], 422);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $record = Category::query()->updateOrCreate(
            ['id' => $category],
            [
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
            ]
        );

        return response()->json(['id' => $record->id, 'synced' => true]);
    }
}

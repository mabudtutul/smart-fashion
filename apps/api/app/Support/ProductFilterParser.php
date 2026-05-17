<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Builder;

final class ProductFilterParser
{
    public static function apply(Builder $query, ?string $filter, array $queryParams = []): Builder
    {
        if ($filter) {
            if (preg_match("/category\s*=\s*'([^']+)'/i", $filter, $m)
                || preg_match('/category\s*=\s*"([^"]+)"/i', $filter, $m)) {
                $query->where('category', $m[1]);
            } elseif (preg_match('/category\s*=\s*([^\s&|]+)/i', $filter, $m)) {
                $query->where('category', trim($m[1], '"\''));
            }

            if (preg_match('/featured\s*=\s*true/i', $filter)) {
                $query->where('featured', true);
            }
            if (preg_match('/bestseller\s*=\s*true/i', $filter)) {
                $query->where('bestseller', true);
            }
            if (preg_match('/\bnew\s*=\s*true/i', $filter)) {
                $query->where('is_new', true);
            }
        }

        if (isset($queryParams['category'])) {
            $query->where('category', $queryParams['category']);
        }
        if (filter_var($queryParams['featured'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->where('featured', true);
        }
        if (filter_var($queryParams['bestseller'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->where('bestseller', true);
        }
        if (filter_var($queryParams['new'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $query->where('is_new', true);
        }

        return $query;
    }

    public static function applySort(Builder $query, ?string $sort): Builder
    {
        if (! $sort) {
            return $query->latest();
        }

        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $field = ltrim($sort, '-');

        $column = match ($field) {
            'created' => 'created_at',
            'updated' => 'updated_at',
            'name', 'price', 'category' => $field,
            default => 'created_at',
        };

        return $query->orderBy($column, $direction);
    }
}

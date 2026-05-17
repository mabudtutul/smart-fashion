<?php

namespace App\Models;

use App\Support\PocketBaseId;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'price',
        'category',
        'image_path',
        'rating',
        'stock',
        'featured',
        'bestseller',
        'is_new',
        'discount',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'rating' => 'float',
            'stock' => 'integer',
            'featured' => 'boolean',
            'bestseller' => 'boolean',
            'is_new' => 'boolean',
            'discount' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Product $product): void {
            if (! $product->id) {
                $product->id = PocketBaseId::generate();
            }
        });
    }
}

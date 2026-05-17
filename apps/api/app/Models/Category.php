<?php

namespace App\Models;

use App\Support\PocketBaseId;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'image_path',
    ];

    protected static function booted(): void
    {
        static::creating(function (Category $category): void {
            if (! $category->id) {
                $category->id = PocketBaseId::generate();
            }
        });
    }
}

<?php

namespace App\Models;

use App\Support\PocketBaseId;
use Illuminate\Database\Eloquent\Model;

class HomepageBanner extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'subtitle',
        'button_text',
        'button_url',
        'placement',
        'image_path',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (HomepageBanner $banner): void {
            if (! $banner->id) {
                $banner->id = PocketBaseId::generate();
            }
        });
    }
}

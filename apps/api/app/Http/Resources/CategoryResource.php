<?php

namespace App\Http\Resources;

use App\Support\PublicUploadUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrls = PublicUploadUrl::categoryVariants($this->id, $this->image_path);
        $imageUrl = PublicUploadUrl::fromPath($this->image_path)
            ?? PublicUploadUrl::primaryFromVariants($imageUrls);

        return [
            'id' => $this->id,
            'collectionId' => 'categories',
            'collectionName' => 'categories',
            'name' => $this->name,
            'description' => $this->description ?? '',
            'image' => PublicUploadUrl::basename($this->image_path),
            'image_path' => $this->image_path,
            'image_url' => $imageUrl,
            'image_urls' => $imageUrls,
            'sort_order' => (int) ($this->sort_order ?? 0),
            'created' => $this->created_at?->toIso8601String(),
            'updated' => $this->updated_at?->toIso8601String(),
        ];
    }
}

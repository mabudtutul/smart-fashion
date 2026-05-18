<?php

namespace App\Http\Resources;

use App\Support\PublicUploadUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrls = PublicUploadUrl::productVariants($this->id, $this->image_path);
        $imageUrl = PublicUploadUrl::fromPath($this->image_path)
            ?? PublicUploadUrl::primaryFromVariants($imageUrls);

        return [
            'id' => $this->id,
            'collectionId' => 'products',
            'collectionName' => 'products',
            'name' => $this->name,
            'description' => $this->description ?? '',
            'price' => $this->price,
            'category' => $this->category,
            'image' => PublicUploadUrl::basename($this->image_path),
            'image_path' => $this->image_path,
            'image_url' => $imageUrl,
            'image_urls' => $imageUrls,
            'rating' => $this->rating,
            'stock' => $this->stock,
            'featured' => (bool) $this->featured,
            'bestseller' => (bool) $this->bestseller,
            'new' => (bool) $this->is_new,
            'discount' => $this->discount,
            'created' => $this->created_at?->toIso8601String(),
            'updated' => $this->updated_at?->toIso8601String(),
        ];
    }
}

<?php

namespace App\Http\Resources;

use App\Support\PublicUploadUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageBannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'button_text' => $this->button_text,
            'button_url' => $this->button_url,
            'placement' => $this->placement,
            'image' => PublicUploadUrl::basename($this->image_path),
            'image_path' => $this->image_path,
            'image_url' => PublicUploadUrl::fromPath($this->image_path),
            'sort_order' => (int) $this->sort_order,
            'is_active' => (bool) $this->is_active,
            'created' => $this->created_at?->toIso8601String(),
            'updated' => $this->updated_at?->toIso8601String(),
        ];
    }
}

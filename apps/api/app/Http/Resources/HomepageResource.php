<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomepageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero_slides' => HeroSlideResource::collection($this->resource['hero_slides'] ?? [])
                ->resolve(),
            'banners' => HomepageBannerResource::collection($this->resource['banners'] ?? [])
                ->resolve(),
        ];
    }
}

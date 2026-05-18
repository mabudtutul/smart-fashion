<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomepageResource;
use App\Models\HeroSlide;
use App\Models\HomepageBanner;
use Illuminate\Http\JsonResponse;

class HomepageController extends Controller
{
    public function show(): JsonResponse
    {
        $heroSlides = HeroSlide::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        $banners = HomepageBanner::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->get();

        return response()->json(new HomepageResource([
            'hero_slides' => $heroSlides,
            'banners' => $banners,
        ]));
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHeroImageRequest;
use App\Http\Resources\HeroSlideResource;
use App\Models\HeroSlide;
use App\Services\Media\CatalogImageProcessor;
use App\Support\UploadsPath;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class HeroSlideImageController extends Controller
{
    use HandlesAdminIdempotency;

    public function store(
        StoreHeroImageRequest $request,
        HeroSlide $hero_slide,
        CatalogImageProcessor $processor,
    ): JsonResponse {
        $slot = $request->validated('slot');
        $action = 'admin.hero_slides.image.'.$hero_slide->id.'.'.$slot;

        return $this->idempotentJson($request, $action, function () use ($request, $hero_slide, $processor, $slot) {
            return DB::transaction(function () use ($request, $hero_slide, $processor, $slot) {
            $relative = $processor->processHeroSlot($request->file('image'), $hero_slide->id, $slot);

            if ($slot === 'desktop') {
                $hero_slide->image_desktop_path = $relative;
            } else {
                $hero_slide->image_mobile_path = $relative;
            }

            $hero_slide->save();

            if (! UploadsPath::exists($relative)) {
                throw ValidationException::withMessages([
                    'image' => ['Image was processed but could not be verified on disk. Check UPLOADS_ROOT.'],
                ]);
            }

            return response()->json([
                'record' => new HeroSlideResource($hero_slide->fresh()),
                'slot' => $slot,
            ]);
            });
        });
    }
}

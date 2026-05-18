<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HeroSlideRequest;
use App\Http\Resources\HeroSlideResource;
use App\Models\HeroSlide;
use App\Support\PocketBasePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroSlideCatalogController extends Controller
{
    use HandlesAdminIdempotency;

    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', 50), 100);
        $page = max((int) $request->query('page', 1), 1);

        $paginator = HeroSlide::query()
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return PocketBasePaginator::response(
            $paginator,
            HeroSlideResource::collection($paginator->getCollection())
        );
    }

    public function show(HeroSlide $hero_slide): JsonResponse
    {
        return response()->json(new HeroSlideResource($hero_slide));
    }

    public function store(HeroSlideRequest $request): JsonResponse
    {
        return $this->idempotentJson($request, 'admin.hero_slides.store', function () use ($request) {
            $slide = HeroSlide::query()->create($request->catalogAttributes());

            return response()->json(new HeroSlideResource($slide), 201);
        });
    }

    public function update(HeroSlideRequest $request, HeroSlide $hero_slide): JsonResponse
    {
        $hero_slide->fill($request->catalogAttributes());
        $hero_slide->save();

        return response()->json(new HeroSlideResource($hero_slide->fresh()));
    }

    public function destroy(HeroSlide $hero_slide): JsonResponse
    {
        $hero_slide->delete();

        return response()->json(['id' => $hero_slide->id, 'deleted' => true]);
    }
}

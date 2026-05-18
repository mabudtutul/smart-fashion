<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HomepageBannerRequest;
use App\Http\Resources\HomepageBannerResource;
use App\Models\HomepageBanner;
use App\Support\PocketBasePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HomepageBannerCatalogController extends Controller
{
    use HandlesAdminIdempotency;

    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('perPage', 50), 100);
        $page = max((int) $request->query('page', 1), 1);

        $paginator = HomepageBanner::query()
            ->orderBy('sort_order')
            ->orderBy('created_at')
            ->paginate($perPage, ['*'], 'page', $page);

        return PocketBasePaginator::response(
            $paginator,
            HomepageBannerResource::collection($paginator->getCollection())
        );
    }

    public function show(HomepageBanner $homepageBanner): JsonResponse
    {
        return response()->json(new HomepageBannerResource($homepageBanner));
    }

    public function store(HomepageBannerRequest $request): JsonResponse
    {
        return $this->idempotentJson($request, 'admin.homepage_banners.store', function () use ($request) {
            $banner = HomepageBanner::query()->create($request->catalogAttributes());

            return response()->json(new HomepageBannerResource($banner), 201);
        });
    }

    public function update(HomepageBannerRequest $request, HomepageBanner $homepageBanner): JsonResponse
    {
        $homepageBanner->fill($request->catalogAttributes());
        $homepageBanner->save();

        return response()->json(new HomepageBannerResource($homepageBanner->fresh()));
    }

    public function destroy(HomepageBanner $homepageBanner): JsonResponse
    {
        $homepageBanner->delete();

        return response()->json(['id' => $homepageBanner->id, 'deleted' => true]);
    }
}

<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Concerns\HandlesAdminIdempotency;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCatalogImageRequest;
use App\Http\Resources\HomepageBannerResource;
use App\Models\HomepageBanner;
use App\Services\Media\CatalogImageProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HomepageBannerImageController extends Controller
{
    use HandlesAdminIdempotency;

    public function store(
        StoreCatalogImageRequest $request,
        HomepageBanner $homepageBanner,
        CatalogImageProcessor $processor,
    ): JsonResponse {
        $action = 'admin.homepage_banners.image.'.$homepageBanner->id;

        return $this->idempotentJson($request, $action, function () use ($request, $homepageBanner, $processor) {
            return DB::transaction(function () use ($request, $homepageBanner, $processor) {
            $homepageBanner->image_path = $processor->processHomepageBanner(
                $request->file('image'),
                $homepageBanner->id
            );
            $homepageBanner->save();

            return response()->json([
                'record' => new HomepageBannerResource($homepageBanner->fresh()),
            ]);
            });
        });
    }
}

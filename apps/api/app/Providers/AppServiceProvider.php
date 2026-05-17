<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ImageManager::class, function () {
            return new ImageManager(new Driver);
        });
    }

    public function boot(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $identity = strtolower((string) $request->input('identity', ''));

            return Limit::perMinute(10)->by($identity.'|'.$request->ip());
        });
    }
}

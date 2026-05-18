<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;
use RuntimeException;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ImageManager::class, function () {
            if (extension_loaded('imagick')) {
                return new ImageManager(new ImagickDriver);
            }

            if (extension_loaded('gd')) {
                return new ImageManager(new GdDriver);
            }

            throw new RuntimeException(
                'PHP GD or Imagick extension is required for catalog image uploads.'
            );
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

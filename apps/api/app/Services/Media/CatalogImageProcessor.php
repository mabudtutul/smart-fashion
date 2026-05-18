<?php

namespace App\Services\Media;

use App\Support\UploadsPath;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use Intervention\Image\ImageManager;
use Throwable;

class CatalogImageProcessor
{
    public function __construct(
        private readonly ImageManager $images,
    ) {}

    /** @return array<string, string> */
    public function processProduct(UploadedFile $file, string $productId): array
    {
        $this->assertSafeId($productId);

        $path = $file->getRealPath();
        if ($path === false) {
            throw ValidationException::withMessages(['image' => ['Invalid upload.']]);
        }

        return $this->processFromPath(
            $path,
            "products/{$productId}",
            config('media.products', [])
        );
    }

    /** @return array<string, string> */
    public function processCategory(UploadedFile $file, string $categoryId): array
    {
        $this->assertSafeId($categoryId);

        $path = $file->getRealPath();
        if ($path === false) {
            throw ValidationException::withMessages(['image' => ['Invalid upload.']]);
        }

        return $this->processFromPath(
            $path,
            "categories/{$categoryId}",
            config('media.categories', [])
        );
    }

    /** @return array<string, string> */
    public function processProductFromPath(string $sourcePath, string $productId): array
    {
        $this->assertSafeId($productId);

        return $this->processFromPath(
            $sourcePath,
            "products/{$productId}",
            config('media.products', [])
        );
    }

    /** @return array<string, string> */
    public function processCategoryFromPath(string $sourcePath, string $categoryId): array
    {
        $this->assertSafeId($categoryId);

        return $this->processFromPath(
            $sourcePath,
            "categories/{$categoryId}",
            config('media.categories', [])
        );
    }

    public function processHeroSlot(UploadedFile $file, string $slideId, string $slot): string
    {
        $this->assertSafeId($slideId);

        if (! in_array($slot, ['desktop', 'mobile'], true)) {
            throw ValidationException::withMessages(['slot' => ['Invalid hero image slot.']]);
        }

        $path = $file->getRealPath();
        if ($path === false) {
            throw ValidationException::withMessages(['image' => ['Invalid upload.']]);
        }

        $size = config("media.hero.{$slot}");
        if (! is_array($size)) {
            throw ValidationException::withMessages(['image' => ['Hero image size not configured.']]);
        }

        return $this->processSingleVariant($path, "homepage/hero/{$slideId}", $slot, $size);
    }

    public function processHomepageBanner(UploadedFile $file, string $bannerId): string
    {
        $this->assertSafeId($bannerId);

        $path = $file->getRealPath();
        if ($path === false) {
            throw ValidationException::withMessages(['image' => ['Invalid upload.']]);
        }

        $variants = config('media.homepage_banners', []);
        $written = $this->processFromPath($path, "homepage/banners/{$bannerId}", $variants);

        return $written['main'] ?? reset($written);
    }

    /**
     * Write one named variant without removing sibling files (e.g. hero desktop vs mobile).
     *
     * @param  array{width: int, height: int}  $size
     */
    public function processSingleVariant(
        string $sourcePath,
        string $relativeDir,
        string $name,
        array $size,
    ): string {
        if (! is_file($sourcePath)) {
            throw ValidationException::withMessages(['image' => ['Uploaded image could not be read.']]);
        }

        $this->validateImageFile($sourcePath);
        UploadsPath::ensureWritable($relativeDir);

        $absoluteDir = UploadsPath::absolute($relativeDir);
        foreach (['webp', 'jpg', 'jpeg'] as $ext) {
            $candidate = $absoluteDir.DIRECTORY_SEPARATOR.$name.'.'.$ext;
            if (is_file($candidate)) {
                @unlink($candidate);
            }
        }

        $quality = (int) config('media.webp_quality', 80);

        try {
            $relative = $this->writeVariant($sourcePath, $absoluteDir, $name, $size, $quality);

            return $relativeDir.'/'.$relative;
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'image' => [
                    'Image processing failed. Ensure PHP GD (with WebP or JPEG) is enabled on the server.',
                ],
            ]);
        }
    }

    /**
     * @param  array<string, array{width: int, height: int}>  $variants
     * @return array<string, string>
     */
    public function processFromPath(string $sourcePath, string $relativeDir, array $variants): array
    {
        if ($variants === []) {
            throw ValidationException::withMessages(['image' => ['No media variants configured.']]);
        }

        if (! is_file($sourcePath)) {
            throw ValidationException::withMessages(['image' => ['Uploaded image could not be read.']]);
        }

        $this->validateImageFile($sourcePath);
        UploadsPath::ensureWritable($relativeDir);

        $absoluteDir = UploadsPath::absolute($relativeDir);

        foreach (File::files($absoluteDir) as $existing) {
            File::delete($existing->getPathname());
        }

        $quality = (int) config('media.webp_quality', 80);
        $written = [];

        try {
            foreach ($variants as $name => $size) {
                $relative = $this->writeVariant($sourcePath, $absoluteDir, $name, $size, $quality);
                $written[$name] = $relativeDir.'/'.$relative;
            }
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            report($e);

            throw ValidationException::withMessages([
                'image' => [
                    'Image processing failed. Ensure PHP GD (with WebP or JPEG) is enabled on the server.',
                ],
            ]);
        }

        if ($written === []) {
            throw ValidationException::withMessages(['image' => ['No image variants were saved.']]);
        }

        return $written;
    }

    /**
     * @param  array{width: int, height: int}  $size
     */
    private function writeVariant(
        string $sourcePath,
        string $absoluteDir,
        string $name,
        array $size,
        int $quality,
    ): string {
        $image = $this->images->read($sourcePath)->orient()->scaleDown(
            $size['width'],
            $size['height']
        );

        $webpPath = $absoluteDir.DIRECTORY_SEPARATOR.$name.'.webp';

        try {
            $image->toWebp($quality)->save($webpPath);

            return $name.'.webp';
        } catch (Throwable $webpError) {
            $jpgPath = $absoluteDir.DIRECTORY_SEPARATOR.$name.'.jpg';

            try {
                $this->images->read($sourcePath)->orient()->scaleDown(
                    $size['width'],
                    $size['height']
                )->toJpeg(min($quality, 95))->save($jpgPath);

                return $name.'.jpg';
            } catch (Throwable $jpegError) {
                report($webpError);
                report($jpegError);

                throw ValidationException::withMessages([
                    'image' => [
                        'Could not convert image. Try JPG/PNG under 8MB, at least '
                        .config('media.min_edge_px', 80).'px per side.',
                    ],
                ]);
            }
        }
    }

    private function validateImageFile(string $path): void
    {
        $info = @getimagesize($path);
        if ($info === false) {
            throw ValidationException::withMessages(['image' => ['File is not a valid image.']]);
        }

        $width = (int) ($info[0] ?? 0);
        $height = (int) ($info[1] ?? 0);
        $maxEdge = (int) config('media.max_edge_px', 4000);
        $minEdge = (int) config('media.min_edge_px', 80);

        if ($width > $maxEdge || $height > $maxEdge) {
            throw ValidationException::withMessages([
                'image' => ["Image dimensions must not exceed {$maxEdge}px."],
            ]);
        }

        if ($width < $minEdge || $height < $minEdge) {
            throw ValidationException::withMessages([
                'image' => ["Image must be at least {$minEdge}×{$minEdge} pixels."],
            ]);
        }

        $allowed = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
        if (! in_array($info[2] ?? 0, $allowed, true)) {
            throw ValidationException::withMessages(['image' => ['Use JPG, PNG, or WebP only.']]);
        }
    }

    private function assertSafeId(string $id): void
    {
        if (! preg_match('/^[a-z0-9]{15}$/', $id)) {
            throw ValidationException::withMessages(['id' => ['Invalid record id.']]);
        }
    }
}

<?php

namespace App\Services\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;
use Intervention\Image\ImageManager;

class CatalogImageProcessor
{
    public function __construct(
        private readonly ImageManager $images,
    ) {}

    /**
     * @param  array<string, array{width: int, height: int}>  $variants
     * @return array<string, string> variant key => relative path under uploads/ (e.g. products/{id}/main.webp)
     */
    public function processProduct(UploadedFile $file, string $productId): array
    {
        $this->assertSafeId($productId);

        return $this->process(
            $file,
            "products/{$productId}",
            config('media.products', [])
        );
    }

    /**
     * @param  array<string, array{width: int, height: int}>  $variants
     * @return array<string, string>
     */
    public function processCategory(UploadedFile $file, string $categoryId): array
    {
        $this->assertSafeId($categoryId);

        return $this->process(
            $file,
            "categories/{$categoryId}",
            config('media.categories', [])
        );
    }

    /**
     * @param  array<string, array{width: int, height: int}>  $variants
     * @return array<string, string>
     */
    private function process(UploadedFile $file, string $relativeDir, array $variants): array
    {
        if ($variants === []) {
            throw ValidationException::withMessages(['image' => ['No media variants configured.']]);
        }

        $tempPath = $file->getRealPath();
        if ($tempPath === false) {
            throw ValidationException::withMessages(['image' => ['Invalid upload.']]);
        }

        $this->validateImageFile($tempPath);

        $absoluteDir = public_path('uploads/'.$relativeDir);
        File::ensureDirectoryExists($absoluteDir);

        if (File::exists($absoluteDir)) {
            foreach (File::files($absoluteDir) as $existing) {
                File::delete($existing->getPathname());
            }
        }

        $quality = (int) config('media.webp_quality', 80);
        $written = [];

        foreach ($variants as $name => $size) {
            $filename = $name.'.webp';
            $destination = $absoluteDir.DIRECTORY_SEPARATOR.$filename;

            $this->images
                ->read($tempPath)
                ->orient()
                ->scaleDown($size['width'], $size['height'])
                ->toWebp($quality)
                ->save($destination);

            $written[$name] = $relativeDir.'/'.$filename;
        }

        return $written;
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
        $minEdge = (int) config('media.min_edge_px', 200);

        if ($width > $maxEdge || $height > $maxEdge) {
            throw ValidationException::withMessages([
                'image' => ["Image dimensions must not exceed {$maxEdge}px."],
            ]);
        }

        if ($width < $minEdge || $height < $minEdge) {
            throw ValidationException::withMessages([
                'image' => ["Image dimensions must be at least {$minEdge}px."],
            ]);
        }

        $allowed = [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP];
        if (! in_array($info[2] ?? 0, $allowed, true)) {
            throw ValidationException::withMessages(['image' => ['Unsupported image type.']]);
        }
    }

    private function assertSafeId(string $id): void
    {
        if (! preg_match('/^[a-z0-9]{15}$/', $id)) {
            throw ValidationException::withMessages(['id' => ['Invalid record id.']]);
        }
    }
}

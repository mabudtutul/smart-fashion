<?php

namespace App\Support;

/**
 * Direct public URLs under /uploads (no storage:link).
 * DB image_path examples: products/{id}/main.webp, categories/{id}/banner.webp
 */
final class PublicUploadUrl
{
    public static function base(): string
    {
        $configured = rtrim((string) config('filesystems.disks.uploads.url'), '/');

        return $configured !== '' ? $configured : rtrim((string) config('app.url'), '/').'/uploads';
    }

    public static function fromPath(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        $normalized = str_replace('\\', '/', $path);
        $normalized = ltrim($normalized, '/');

        if (str_starts_with($normalized, 'uploads/')) {
            $normalized = substr($normalized, strlen('uploads/'));
        }

        return self::base().'/'.$normalized;
    }

    public static function basename(?string $path): string
    {
        if ($path === null || $path === '') {
            return '';
        }

        return basename(str_replace('\\', '/', $path));
    }

    /** @return array<string, string>|null */
    public static function productVariants(string $productId, ?string $imagePath = null): ?array
    {
        if ($imagePath === null || $imagePath === '') {
            return null;
        }

        $prefix = "products/{$productId}";

        return self::variantMap($prefix, ['main', 'card', 'thumb']);
    }

    /** @return array<string, string>|null */
    public static function categoryVariants(string $categoryId, ?string $imagePath = null): ?array
    {
        if ($imagePath === null || $imagePath === '') {
            return null;
        }

        $prefix = "categories/{$categoryId}";

        return self::variantMap($prefix, ['banner', 'thumb']);
    }

    /**
     * @param  list<string>  $names
     * @return array<string, string>|null
     */
    private static function variantMap(string $prefix, array $names): ?array
    {
        $urls = [];

        foreach ($names as $name) {
            $relative = "{$prefix}/{$name}.webp";
            if (is_file(public_path('uploads/'.$relative))) {
                $urls[$name] = self::fromPath($relative);
            }
        }

        return $urls === [] ? null : $urls;
    }

    public static function primaryFromVariants(?array $urls): ?string
    {
        if ($urls === null || $urls === []) {
            return null;
        }

        return $urls['main'] ?? $urls['banner'] ?? $urls['card'] ?? reset($urls) ?: null;
    }
}

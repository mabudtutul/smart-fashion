<?php

namespace App\Support;

use Illuminate\Support\Facades\File;
use Illuminate\Validation\ValidationException;

/**
 * Resolves catalog upload directory (Hostinger: public_html/uploads via UPLOADS_ROOT or symlink).
 */
final class UploadsPath
{
    public static function root(): string
    {
        $configured = config('media.uploads_root');
        if (is_string($configured) && $configured !== '') {
            return rtrim(str_replace('\\', '/', $configured), '/');
        }

        return rtrim(str_replace('\\', '/', public_path('uploads')), '/');
    }

    public static function absolute(string $relative): string
    {
        $relative = ltrim(str_replace('\\', '/', $relative), '/');

        return self::root().'/'.$relative;
    }

    public static function exists(string $relative): bool
    {
        return is_file(self::absolute($relative));
    }

    /**
     * Ensure uploads root and target directory exist and are writable.
     */
    public static function ensureWritable(string $relativeDir): void
    {
        $root = self::root();

        if (! is_dir($root) && ! @mkdir($root, 0755, true) && ! is_dir($root)) {
            throw ValidationException::withMessages([
                'image' => [
                    'Upload directory is missing. Run deploy/apply-hostinger-routing.sh or set UPLOADS_ROOT in .env.',
                ],
            ]);
        }

        if (! is_writable($root)) {
            throw ValidationException::withMessages([
                'image' => [
                    'Upload directory is not writable. chmod 755 (or 775) on public_html/uploads.',
                ],
            ]);
        }

        $absoluteDir = self::absolute($relativeDir);

        if (! is_dir($absoluteDir) && ! @mkdir($absoluteDir, 0755, true) && ! is_dir($absoluteDir)) {
            throw ValidationException::withMessages([
                'image' => ['Could not create image folder on the server.'],
            ]);
        }

        if (! is_writable($absoluteDir)) {
            throw ValidationException::withMessages([
                'image' => ['Image folder is not writable. Check uploads permissions on the server.'],
            ]);
        }
    }

    /**
     * Resolve first existing variant file (webp, jpg, jpeg).
     *
     * @return array{0: string, 1: string}|null relative path and extension
     */
    public static function findVariantFile(string $prefix, string $name): ?array
    {
        foreach (['webp', 'jpg', 'jpeg'] as $ext) {
            $relative = "{$prefix}/{$name}.{$ext}";
            if (self::exists($relative)) {
                return [$relative, $ext];
            }
        }

        return null;
    }

    /** Remove all files under a catalog folder (e.g. products/{id}). */
    public static function deleteRelativeDirectory(string $relativeDir): void
    {
        $relativeDir = trim(str_replace('\\', '/', $relativeDir), '/');
        if ($relativeDir === '' || str_contains($relativeDir, '..')) {
            return;
        }

        $absolute = self::absolute($relativeDir);
        if (is_dir($absolute)) {
            File::deleteDirectory($absolute);
        }
    }
}

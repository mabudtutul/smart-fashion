<?php

namespace App\Services\Import;

final class PocketBaseStorageImageResolver
{
    public function __construct(
        private readonly string $pbStorageRoot,
        private readonly string $productsCollectionId,
        private readonly string $categoriesCollectionId,
    ) {}

    public function resolve(string $recordId, ?string $filename, string $kind): ?string
    {
        $collectionId = $kind === 'category'
            ? $this->categoriesCollectionId
            : $this->productsCollectionId;

        $base = $this->recordDir($collectionId, $recordId);
        if ($base === null) {
            return null;
        }

        if ($filename !== null && $filename !== '') {
            $candidate = $base.DIRECTORY_SEPARATOR.$filename;
            if (is_file($candidate) && $this->isSourceImage($candidate)) {
                return $candidate;
            }
        }

        foreach (glob($base.DIRECTORY_SEPARATOR.'*') ?: [] as $path) {
            if (! is_file($path)) {
                continue;
            }
            if ($this->isSourceImage($path)) {
                return $path;
            }
        }

        return null;
    }

    private function recordDir(string $collectionId, string $recordId): ?string
    {
        $direct = rtrim($this->pbStorageRoot, '/\\')
            .DIRECTORY_SEPARATOR.'storage'
            .DIRECTORY_SEPARATOR.$collectionId
            .DIRECTORY_SEPARATOR.$recordId;

        if (is_dir($direct)) {
            return $direct;
        }

        $pattern = rtrim($this->pbStorageRoot, '/\\')
            .DIRECTORY_SEPARATOR.'storage'
            .DIRECTORY_SEPARATOR.'*'
            .DIRECTORY_SEPARATOR.$recordId;

        foreach (glob($pattern) ?: [] as $match) {
            if (is_dir($match)) {
                return $match;
            }
        }

        return null;
    }

    private function isSourceImage(string $path): bool
    {
        $name = basename($path);
        if (str_starts_with($name, 'thumbs_')) {
            return false;
        }

        return (bool) preg_match('/\.(jpe?g|png|gif|webp)$/i', $name);
    }
}

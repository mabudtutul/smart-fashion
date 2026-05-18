<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class StoreCatalogImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->hasFile('image')) {
            return;
        }

        $contentLength = (int) ($this->server('CONTENT_LENGTH') ?? 0);
        if ($contentLength <= 0) {
            return;
        }

        $postMax = self::parseIniSize((string) ini_get('post_max_size'));
        $uploadMax = self::parseIniSize((string) ini_get('upload_max_filesize'));
        $limit = min(
            $postMax > 0 ? $postMax : PHP_INT_MAX,
            $uploadMax > 0 ? $uploadMax : PHP_INT_MAX,
        );

        if ($limit !== PHP_INT_MAX && $contentLength > $limit) {
            throw ValidationException::withMessages([
                'image' => [
                    'The image exceeds the server upload limit ('.self::formatBytes($limit).'). Use a smaller file.',
                ],
            ]);
        }
    }

    public function rules(): array
    {
        $maxKb = (int) config('media.max_upload_kb', 8192);

        return [
            'image' => ['required', 'file', 'mimes:jpeg,jpg,png,webp', 'max:'.$maxKb],
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'No image received. The file may exceed server limits or the upload was interrupted.',
            'image.max' => 'Image must not exceed '.((int) config('media.max_upload_kb', 8192) / 1024).' MB.',
        ];
    }

    private static function parseIniSize(string $value): int
    {
        $value = trim($value);
        if ($value === '' || $value === '-1') {
            return 0;
        }

        $unit = strtolower(substr($value, -1));
        $number = (float) $value;

        return match ($unit) {
            'g' => (int) ($number * 1024 * 1024 * 1024),
            'm' => (int) ($number * 1024 * 1024),
            'k' => (int) ($number * 1024),
            default => (int) $number,
        };
    }

    private static function formatBytes(int $bytes): string
    {
        if ($bytes >= 1024 * 1024) {
            return round($bytes / (1024 * 1024), 1).' MB';
        }

        return round($bytes / 1024).' KB';
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCatalogImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $maxKb = (int) config('media.max_upload_kb', 8192);

        return [
            'image' => ['required', 'file', 'mimes:jpeg,jpg,png,webp', 'max:'.$maxKb],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHeroImageRequest extends StoreCatalogImageRequest
{
    public function rules(): array
    {
        return array_merge(parent::rules(), [
            'slot' => ['required', 'string', Rule::in(['desktop', 'mobile'])],
        ]);
    }
}

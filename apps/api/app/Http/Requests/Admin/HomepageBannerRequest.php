<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class HomepageBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:500'],
            'button_text' => ['nullable', 'string', 'max:120'],
            'button_url' => ['nullable', 'string', 'max:500'],
            'placement' => ['sometimes', 'string', 'max:32', Rule::in(['promo_row', 'promo_2col_left', 'promo_2col_right'])],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:9999'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /** @return array<string, mixed> */
    public function catalogAttributes(): array
    {
        $data = $this->validated();

        return [
            'title' => $data['title'] ?? '',
            'subtitle' => $data['subtitle'] ?? '',
            'button_text' => $data['button_text'] ?? '',
            'button_url' => $data['button_url'] ?? '',
            'placement' => $data['placement'] ?? 'promo_row',
            'sort_order' => (int) ($data['sort_order'] ?? 0),
            'is_active' => (bool) ($data['is_active'] ?? true),
        ];
    }
}

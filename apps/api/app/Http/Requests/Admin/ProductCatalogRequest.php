<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'category' => ['required', 'string', 'max:255'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'discount' => ['nullable', 'integer', 'min:0', 'max:100'],
            'featured' => ['sometimes', 'boolean'],
            'bestseller' => ['sometimes', 'boolean'],
            'new' => ['sometimes', 'boolean'],
        ];
    }

    /** @return array<string, mixed> */
    public function catalogAttributes(): array
    {
        $data = $this->validated();

        return [
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'price' => $data['price'],
            'category' => $data['category'],
            'stock' => $data['stock'] ?? null,
            'discount' => $data['discount'] ?? null,
            'featured' => (bool) ($data['featured'] ?? false),
            'bestseller' => (bool) ($data['bestseller'] ?? false),
            'is_new' => (bool) ($data['new'] ?? false),
        ];
    }
}

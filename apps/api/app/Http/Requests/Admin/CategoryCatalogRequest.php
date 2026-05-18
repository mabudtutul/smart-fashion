<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryCatalogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore(
                    $this->route('category') instanceof Category
                        ? $this->route('category')->getKey()
                        : $this->route('category')
                ),
            ],
            'description' => ['nullable', 'string'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:9999'],
        ];
    }

    /** @return array<string, mixed> */
    public function catalogAttributes(): array
    {
        $data = $this->validated();

        return [
            'name' => $data['name'],
            'description' => $data['description'] ?? '',
            'sort_order' => (int) ($data['sort_order'] ?? 0),
        ];
    }
}

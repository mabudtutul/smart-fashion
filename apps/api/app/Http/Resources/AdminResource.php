<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'collectionId' => '_superusers',
            'collectionName' => '_superusers',
            'email' => $this->email,
            'name' => $this->name,
            'verified' => true,
            'created' => $this->created_at?->toIso8601String(),
            'updated' => $this->updated_at?->toIso8601String(),
        ];
    }
}

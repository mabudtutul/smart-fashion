<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::query()->updateOrCreate(
            ['email' => 'admin@smartfashion.site'],
            [
                'name' => 'Smart Fashion Admin',
                'password' => 'Admin@12345',
            ]
        );
    }
}

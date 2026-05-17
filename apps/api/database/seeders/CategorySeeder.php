<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Clothing',
                'description' => 'Discover our premium collection of clothing including t-shirts, shirts, dresses, blazers, hoodies, pants, blouses, and jackets for all seasons and occasions.',
            ],
            [
                'name' => 'Shoes',
                'description' => 'Explore our extensive range of footwear including sneakers, canvas shoes, formal leather shoes, basketball shoes, loafers, boots, sandals, and designer heels.',
            ],
            [
                'name' => "Men's Fashion",
                'description' => "Shop the latest men's fashion trends including casual wear, formal attire, and accessories designed for the modern man.",
            ],
            [
                'name' => "Women's Fashion",
                'description' => "Browse our curated selection of women's fashion featuring dresses, tops, bottoms, and outerwear for every style and occasion.",
            ],
            [
                'name' => 'Fashion Jewelry',
                'description' => 'Elevate your style with our exquisite jewelry collection featuring necklaces, earrings, rings, and bracelets crafted with premium materials.',
            ],
            [
                'name' => 'Accessories',
                'description' => 'Complete your outfit with bags, belts, watches, sunglasses, and other premium accessories.',
            ],
        ];

        foreach ($categories as $row) {
            Category::query()->firstOrCreate(
                ['name' => $row['name']],
                ['description' => $row['description']]
            );
        }
    }
}

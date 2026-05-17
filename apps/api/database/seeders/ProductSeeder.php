<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Premium Cotton T-Shirt',
                'description' => 'Comfortable and breathable premium cotton t-shirt perfect for everyday wear.',
                'price' => 599,
                'category' => 'Clothing',
                'stock' => 50,
                'rating' => 4.5,
                'featured' => true,
            ],
            [
                'name' => 'Casual Denim Shirt',
                'description' => 'Versatile denim shirt ideal for casual outings.',
                'price' => 1299,
                'category' => 'Clothing',
                'stock' => 35,
                'rating' => 4.2,
                'featured' => true,
            ],
            [
                'name' => 'Summer Dress',
                'description' => 'Light and elegant summer dress perfect for warm weather.',
                'price' => 1899,
                'category' => 'Clothing',
                'stock' => 25,
                'rating' => 4.8,
                'featured' => true,
                'is_new' => true,
            ],
            [
                'name' => 'Running Sneakers',
                'description' => 'Lightweight running sneakers with cushioned sole.',
                'price' => 2499,
                'category' => 'Shoes',
                'stock' => 40,
                'rating' => 4.6,
                'bestseller' => true,
            ],
            [
                'name' => 'Leather Formal Shoes',
                'description' => 'Classic leather formal shoes for office and events.',
                'price' => 3499,
                'category' => 'Shoes',
                'stock' => 20,
                'rating' => 4.4,
                'bestseller' => true,
            ],
            [
                'name' => 'Gold Plated Necklace',
                'description' => 'Elegant gold plated necklace for special occasions.',
                'price' => 899,
                'category' => 'Fashion Jewelry',
                'stock' => 15,
                'rating' => 4.7,
                'featured' => true,
            ],
            [
                'name' => 'Men Slim Fit Blazer',
                'description' => 'Modern slim fit blazer for smart casual looks.',
                'price' => 3999,
                'category' => "Men's Fashion",
                'stock' => 12,
                'rating' => 4.3,
                'is_new' => true,
            ],
            [
                'name' => 'Women Floral Top',
                'description' => 'Soft floral print top with relaxed fit.',
                'price' => 999,
                'category' => "Women's Fashion",
                'stock' => 30,
                'rating' => 4.5,
                'discount' => 10,
            ],
            [
                'name' => 'Canvas Tote Bag',
                'description' => 'Durable canvas tote for daily use.',
                'price' => 699,
                'category' => 'Accessories',
                'stock' => 45,
                'rating' => 4.1,
            ],
            [
                'name' => 'Classic Sunglasses',
                'description' => 'UV-protected classic frame sunglasses.',
                'price' => 499,
                'category' => 'Accessories',
                'stock' => 60,
                'rating' => 4.0,
                'bestseller' => true,
            ],
        ];

        foreach ($products as $row) {
            Product::query()->firstOrCreate(
                ['name' => $row['name']],
                $row
            );
        }
    }
}

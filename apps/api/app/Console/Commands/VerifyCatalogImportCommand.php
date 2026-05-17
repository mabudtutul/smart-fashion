<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Support\PublicUploadUrl;
use Illuminate\Console\Command;

class VerifyCatalogImportCommand extends Command
{
    protected $signature = 'catalog:verify-import';

    protected $description = 'Verify migrated catalog counts and image_path coverage';

    public function handle(): int
    {
        $categories = Category::query()->count();
        $products = Product::query()->count();
        $withImages = Product::query()
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->count();
        $categoriesWithImages = Category::query()
            ->whereNotNull('image_path')
            ->where('image_path', '!=', '')
            ->count();

        $this->info('Catalog import verification');
        $this->table(
            ['Metric', 'Count'],
            [
                ['Categories', $categories],
                ['Categories with image_path', $categoriesWithImages],
                ['Products', $products],
                ['Products with image_path', $withImages],
            ]
        );

        $sample = Product::query()->whereNotNull('image_path')->first();
        if ($sample) {
            $url = PublicUploadUrl::fromPath($sample->image_path);
            $this->line("Sample product: {$sample->id} — {$sample->name}");
            $this->line("Sample image URL: {$url}");
        } else {
            $this->warn('No products with image_path — run import with --with-images or upload in admin.');
        }

        $orphans = Product::query()
            ->whereNotIn('category', Category::query()->pluck('name'))
            ->count();
        if ($orphans > 0) {
            $this->warn("Products referencing unknown category names: {$orphans}");
        }

        if ($categories === 0 || $products === 0) {
            $this->error('Catalog empty — run catalog:import-pocketbase before client delivery.');

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}

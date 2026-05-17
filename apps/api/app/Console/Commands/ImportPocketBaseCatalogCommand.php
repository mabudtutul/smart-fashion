<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use App\Services\Import\ImportReport;
use App\Services\Import\PocketBaseCatalogImporter;
use App\Services\Import\PocketBaseStorageImageResolver;
use Illuminate\Console\Command;
use InvalidArgumentException;

class ImportPocketBaseCatalogCommand extends Command
{
    protected $signature = 'catalog:import-pocketbase
                            {file : JSON export (combined or PocketBase list response)}
                            {--dry-run : Validate and report without database or image writes}
                            {--with-images : Process files from PocketBase pb_data/storage}
                            {--pb-storage= : Path to pb_data directory (required with --with-images)}
                            {--collection= : categories|products when file is a bare list or single-collection API export}
                            {--categories= : Additional categories JSON file}
                            {--products= : Additional products JSON file}';

    protected $description = 'Import PocketBase catalog records into Laravel (IDs and timestamps preserved)';

    public function handle(PocketBaseCatalogImporter $importer): int
    {
        try {
            $collection = $this->option('collection');
            $collectionHint = $collection !== null && $collection !== ''
                ? strtolower((string) $collection)
                : null;

            if ($collectionHint !== null && ! in_array($collectionHint, ['categories', 'products'], true)) {
                $this->error('--collection must be categories or products.');

                return self::FAILURE;
            }

            $parsed = PocketBaseCatalogImporter::parseJsonFile((string) $this->argument('file'), $collectionHint);
            $categories = $parsed['categories'];
            $products = $parsed['products'];

            if ($extra = $this->option('categories')) {
                $extraParsed = PocketBaseCatalogImporter::parseJsonFile((string) $extra, 'categories');
                $categories = array_merge($categories, $extraParsed['categories']);
            }

            if ($extra = $this->option('products')) {
                $extraParsed = PocketBaseCatalogImporter::parseJsonFile((string) $extra, 'products');
                $products = array_merge($products, $extraParsed['products']);
            }

            $dryRun = (bool) $this->option('dry-run');
            $withImages = (bool) $this->option('with-images');

            $imageResolver = null;
            if ($withImages) {
                $storage = (string) ($this->option('pb-storage') ?? '');
                if ($storage === '') {
                    $this->error('--pb-storage is required when using --with-images.');

                    return self::FAILURE;
                }
                if (! is_dir($storage)) {
                    $this->error("pb-storage directory not found: {$storage}");

                    return self::FAILURE;
                }

                $imageResolver = new PocketBaseStorageImageResolver(
                    $storage,
                    (string) config('import.pocketbase.products_collection_id'),
                    (string) config('import.pocketbase.categories_collection_id'),
                );
            }

            $this->line(sprintf(
                'Import plan: %d categor%s, %d product%s%s',
                count($categories),
                count($categories) === 1 ? 'y' : 'ies',
                count($products),
                count($products) === 1 ? '' : 's',
                $dryRun ? ' [DRY RUN]' : ''
            ));

            $report = $importer->run($categories, $products, $dryRun, $withImages, $imageResolver);

            $this->renderReport($report);

            if (! $dryRun && ! $report->hasErrors()) {
                $this->renderVerification($categories, $products);
            }

            return $report->hasErrors() ? self::FAILURE : self::SUCCESS;
        } catch (InvalidArgumentException $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }
    }

    private function renderReport(ImportReport $report): void
    {
        if ($report->errors !== []) {
            $this->newLine();
            $this->error('Errors:');
            foreach ($report->errors as $message) {
                $this->line("  • {$message}");
            }
        }

        if ($report->warnings !== []) {
            $this->newLine();
            $this->warn('Warnings:');
            foreach ($report->warnings as $message) {
                $this->line("  • {$message}");
            }
        }

        $this->newLine();
        $this->info($report->dryRun ? 'Dry-run summary' : 'Import summary');
        $this->table(
            ['', 'insert', 'update'],
            [
                ['Categories', $report->categoriesInserted, $report->categoriesUpdated],
                ['Products', $report->productsInserted, $report->productsUpdated],
            ]
        );

        if ($report->categoryImagesProcessed + $report->categoryImagesMissing + $report->categoryImageFailures > 0
            || $report->productImagesProcessed + $report->productImagesMissing + $report->productImageFailures > 0) {
            $this->table(
                ['Images', 'ready/processed', 'missing', 'failed'],
                [
                    ['Categories', $report->categoryImagesProcessed, $report->categoryImagesMissing, $report->categoryImageFailures],
                    ['Products', $report->productImagesProcessed, $report->productImagesMissing, $report->productImageFailures],
                ]
            );
        }
    }

    /**
     * @param  array<int, array<string, mixed>>  $categories
     * @param  array<int, array<string, mixed>>  $products
     */
    private function renderVerification(array $categories, array $products): void
    {
        $dbCategories = Category::query()->count();
        $dbProducts = Product::query()->count();
        $withImages = Product::query()->whereNotNull('image_path')->where('image_path', '!=', '')->count();

        $this->newLine();
        $this->info('Staging verification (database)');
        $this->table(
            ['', 'import file', 'database'],
            [
                ['Categories', count($categories), $dbCategories],
                ['Products', count($products), $dbProducts],
            ]
        );

        $sampleIds = array_slice(array_map(fn (array $r) => (string) $r['id'], $products), 0, 3);
        $found = $sampleIds === []
            ? []
            : Product::query()->whereIn('id', $sampleIds)->pluck('id')->all();

        $this->line('Products with image_path: '.$withImages.' / '.$dbProducts);
        if ($sampleIds !== []) {
            $this->line('Sample product IDs present: '.implode(', ', $found));
            $missing = array_diff($sampleIds, $found);
            if ($missing !== []) {
                $this->warn('Sample IDs missing: '.implode(', ', $missing));
            }
        }

        $this->newLine();
        $this->line('Next: GET /api/v1/categories and /api/v1/products on staging API; spot-check /uploads URLs.');
    }
}

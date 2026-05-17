<?php

namespace App\Services\Import;

use App\Models\Category;
use App\Models\Product;
use App\Services\Media\CatalogImageProcessor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class PocketBaseCatalogImporter
{
    public function __construct(
        private readonly CatalogImageProcessor $images,
    ) {}

    /**
     * @param  array<int, array<string, mixed>>  $categories
     * @param  array<int, array<string, mixed>>  $products
     */
    public function run(
        array $categories,
        array $products,
        bool $dryRun,
        bool $withImages,
        ?PocketBaseStorageImageResolver $imageResolver,
    ): ImportReport {
        $report = new ImportReport;
        $report->dryRun = $dryRun;

        $this->validateUniqueIds($categories, 'category', $report);
        $this->validateUniqueIds($products, 'product', $report);

        if ($report->hasErrors()) {
            return $report;
        }

        $categoryNames = [];
        foreach ($categories as $row) {
            $name = trim((string) ($row['name'] ?? ''));
            if ($name !== '') {
                $categoryNames[$name] = true;
            }
        }

        foreach ($products as $row) {
            $cat = trim((string) ($row['category'] ?? ''));
            if ($cat !== '' && ! isset($categoryNames[$cat])) {
                $report->orphanProductCategories[$cat] = ($report->orphanProductCategories[$cat] ?? 0) + 1;
            }
        }

        foreach (array_keys($report->orphanProductCategories) as $orphan) {
            $count = $report->orphanProductCategories[$orphan];
            $report->addWarning("Product category not in import set: \"{$orphan}\" ({$count} product(s))");
        }

        if ($report->hasErrors()) {
            return $report;
        }

        $runner = function () use ($categories, $products, $dryRun, $withImages, $imageResolver, $report): void {
            foreach ($categories as $row) {
                $this->importCategory($row, $dryRun, $withImages, $imageResolver, $report);
            }

            foreach ($products as $row) {
                $this->importProduct($row, $dryRun, $withImages, $imageResolver, $report);
            }
        };

        if ($dryRun) {
            $runner();

            return $report;
        }

        DB::transaction($runner);

        return $report;
    }

    /**
     * @return array{categories: array<int, array<string, mixed>>, products: array<int, array<string, mixed>>}
     */
    public static function parseJsonFile(string $path, ?string $collectionHint): array
    {
        if (! is_file($path)) {
            throw new InvalidArgumentException("Import file not found: {$path}");
        }

        $raw = json_decode((string) file_get_contents($path), true);
        if (! is_array($raw)) {
            throw new InvalidArgumentException('Import file must contain valid JSON.');
        }

        $categories = self::extractRecords($raw, 'categories', $collectionHint);
        $products = self::extractRecords($raw, 'products', $collectionHint);

        if ($categories === [] && $products === [] && array_is_list($raw)) {
            if ($collectionHint === null) {
                throw new InvalidArgumentException(
                    'Bare record array detected; pass --collection=categories or --collection=products.'
                );
            }

            if ($collectionHint === 'categories') {
                $categories = $raw;
            } elseif ($collectionHint === 'products') {
                $products = $raw;
            } else {
                throw new InvalidArgumentException('--collection must be categories or products.');
            }
        }

        if ($categories === [] && $products === []) {
            throw new InvalidArgumentException(
                'No categories or products found. Use combined {"categories":[],"products":[]} or a PocketBase list export with --collection.'
            );
        }

        return ['categories' => $categories, 'products' => $products];
    }

    /**
     * @param  array<string, mixed>  $raw
     * @return array<int, array<string, mixed>>
     */
    private static function extractRecords(array $raw, string $key, ?string $collectionHint): array
    {
        $hasCombined = isset($raw['categories']) && isset($raw['products']);
        if ($collectionHint !== null && $collectionHint !== $key && ! $hasCombined) {
            return [];
        }

        if (! isset($raw[$key])) {
            if (isset($raw['items']) && ($collectionHint === $key || $collectionHint !== null)) {
                return $raw['items'];
            }

            return [];
        }

        $block = $raw[$key];
        if (is_array($block) && isset($block['items']) && is_array($block['items'])) {
            return $block['items'];
        }

        if (is_array($block) && array_is_list($block)) {
            return $block;
        }

        return [];
    }

    /**
     * @param  array<int, array<string, mixed>>  $rows
     */
    private function validateUniqueIds(array $rows, string $label, ImportReport $report): void
    {
        $seen = [];
        foreach ($rows as $index => $row) {
            $id = (string) ($row['id'] ?? '');
            if (! preg_match('/^[a-z0-9]{15}$/', $id)) {
                $report->addError("Invalid {$label} id at index {$index}: \"{$id}\"");

                continue;
            }
            if (isset($seen[$id])) {
                $report->addError("Duplicate {$label} id: {$id}");
            }
            $seen[$id] = true;
        }
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function importCategory(
        array $row,
        bool $dryRun,
        bool $withImages,
        ?PocketBaseStorageImageResolver $imageResolver,
        ImportReport $report,
    ): void {
        $id = (string) $row['id'];
        $attributes = [
            'name' => (string) ($row['name'] ?? ''),
            'description' => $row['description'] ?? null,
        ];

        $exists = Category::query()->whereKey($id)->exists();
        if ($dryRun) {
            $exists ? $report->categoriesUpdated++ : $report->categoriesInserted++;

            $this->dryRunImage('category', $id, $row, $withImages, $imageResolver, $report);

            return;
        }

        $model = Category::query()->updateOrCreate(['id' => $id], $attributes);
        $this->applyTimestamps($model, $row);

        $exists ? $report->categoriesUpdated++ : $report->categoriesInserted++;

        if ($withImages && $imageResolver !== null) {
            $this->processCategoryImage($model, $row, $imageResolver, $report);
        }
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function importProduct(
        array $row,
        bool $dryRun,
        bool $withImages,
        ?PocketBaseStorageImageResolver $imageResolver,
        ImportReport $report,
    ): void {
        $id = (string) $row['id'];
        $attributes = [
            'name' => (string) ($row['name'] ?? ''),
            'description' => $row['description'] ?? null,
            'price' => (float) ($row['price'] ?? 0),
            'category' => (string) ($row['category'] ?? ''),
            'rating' => isset($row['rating']) ? (float) $row['rating'] : null,
            'stock' => isset($row['stock']) ? (int) $row['stock'] : null,
            'featured' => (bool) ($row['featured'] ?? false),
            'bestseller' => (bool) ($row['bestseller'] ?? false),
            'is_new' => (bool) ($row['new'] ?? $row['is_new'] ?? false),
            'discount' => isset($row['discount']) ? (int) $row['discount'] : null,
        ];

        $exists = Product::query()->whereKey($id)->exists();
        if ($dryRun) {
            $exists ? $report->productsUpdated++ : $report->productsInserted++;

            $this->dryRunImage('product', $id, $row, $withImages, $imageResolver, $report);

            return;
        }

        $model = Product::query()->updateOrCreate(['id' => $id], $attributes);
        $this->applyTimestamps($model, $row);

        $exists ? $report->productsUpdated++ : $report->productsInserted++;

        if ($withImages && $imageResolver !== null) {
            $this->processProductImage($model, $row, $imageResolver, $report);
        }
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function dryRunImage(
        string $kind,
        string $id,
        array $row,
        bool $withImages,
        ?PocketBaseStorageImageResolver $imageResolver,
        ImportReport $report,
    ): void {
        if (! $withImages) {
            return;
        }

        if ($imageResolver === null) {
            $report->addError('Image import requested but pb-storage path is missing.');

            return;
        }

        $filename = self::imageFilename($row['image'] ?? null);
        $path = $imageResolver->resolve($id, $filename, $kind === 'category' ? 'category' : 'product');

        if ($path === null) {
            if ($kind === 'category') {
                $report->categoryImagesMissing++;
            } else {
                $report->productImagesMissing++;
            }

            return;
        }

        if ($kind === 'category') {
            $report->categoryImagesProcessed++;
        } else {
            $report->productImagesProcessed++;
        }
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function processCategoryImage(
        Category $model,
        array $row,
        PocketBaseStorageImageResolver $imageResolver,
        ImportReport $report,
    ): void {
        $filename = self::imageFilename($row['image'] ?? null);
        $source = $imageResolver->resolve($model->id, $filename, 'category');

        if ($source === null) {
            $report->categoryImagesMissing++;

            return;
        }

        try {
            $paths = $this->images->processCategoryFromPath($source, $model->id);
            $model->image_path = $paths['banner'] ?? reset($paths) ?: null;
            $model->save();
            $report->categoryImagesProcessed++;
        } catch (ValidationException $e) {
            $report->categoryImageFailures++;
            $report->addWarning("Category {$model->id} image failed: ".$e->getMessage());
        }
    }

    /**
     * @param  array<string, mixed>  $row
     */
    private function processProductImage(
        Product $model,
        array $row,
        PocketBaseStorageImageResolver $imageResolver,
        ImportReport $report,
    ): void {
        $filename = self::imageFilename($row['image'] ?? null);
        $source = $imageResolver->resolve($model->id, $filename, 'product');

        if ($source === null) {
            $report->productImagesMissing++;

            return;
        }

        try {
            $paths = $this->images->processProductFromPath($source, $model->id);
            $model->image_path = $paths['main'] ?? reset($paths) ?: null;
            $model->save();
            $report->productImagesProcessed++;
        } catch (ValidationException $e) {
            $report->productImageFailures++;
            $report->addWarning("Product {$model->id} image failed: ".$e->getMessage());
        }
    }

    private function applyTimestamps(Category|Product $model, array $row): void
    {
        $created = self::parsePbDate($row['created'] ?? $row['created_at'] ?? null);
        $updated = self::parsePbDate($row['updated'] ?? $row['updated_at'] ?? null);

        if ($created !== null) {
            $model->created_at = $created;
        }
        if ($updated !== null) {
            $model->updated_at = $updated;
        }

        if ($created !== null || $updated !== null) {
            $model->saveQuietly();
        }
    }

    private static function parsePbDate(mixed $value): ?Carbon
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return Carbon::parse((string) $value);
        } catch (\Throwable) {
            return null;
        }
    }

    public static function imageFilename(mixed $image): ?string
    {
        if ($image === null || $image === '') {
            return null;
        }

        if (is_string($image)) {
            return $image;
        }

        if (is_array($image)) {
            $first = $image[0] ?? null;

            return is_string($first) && $first !== '' ? $first : null;
        }

        return null;
    }
}

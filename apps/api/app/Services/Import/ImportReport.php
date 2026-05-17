<?php

namespace App\Services\Import;

final class ImportReport
{
    /** @var list<string> */
    public array $errors = [];

    /** @var list<string> */
    public array $warnings = [];

    public int $categoriesInserted = 0;

    public int $categoriesUpdated = 0;

    public int $productsInserted = 0;

    public int $productsUpdated = 0;

    public int $categoryImagesProcessed = 0;

    public int $categoryImagesMissing = 0;

    public int $productImagesProcessed = 0;

    public int $productImagesMissing = 0;

    public int $categoryImageFailures = 0;

    public int $productImageFailures = 0;

    /** @var list<string> */
    public array $orphanProductCategories = [];

    public bool $dryRun = false;

    public function addError(string $message): void
    {
        $this->errors[] = $message;
    }

    public function addWarning(string $message): void
    {
        $this->warnings[] = $message;
    }

    public function hasErrors(): bool
    {
        return $this->errors !== [];
    }
}

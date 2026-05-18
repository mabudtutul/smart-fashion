<?php

return [
    /*
    | Default disk for future admin uploads. Uses public/uploads/ (no storage:link).
    */
    'default' => env('FILESYSTEM_DISK', 'uploads'),

    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        /*
        | Hostinger-safe public uploads — files live in public/uploads/{products,categories}/.
        | URL: {APP_URL}/uploads/products/file.webp
        */
        'uploads' => [
            'driver' => 'local',
            'root' => env('UPLOADS_ROOT') ?: public_path('uploads'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/uploads',
            'visibility' => 'public',
            'throw' => false,
        ],

        /*
        | Legacy disk — do not use for new catalog images (requires storage:link).
        */
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],
    ],

    /*
    | Symlinks disabled on Hostinger — leave empty.
    */
    'links' => [],
];

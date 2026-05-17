<?php

/**
 * Resolve private/smartfashion-api from public_html or public_html/api.
 */
function smartfashion_hostinger_app_root(): string
{
    $candidates = [
        dirname(__DIR__).'/private/smartfashion-api',
        dirname(__DIR__, 2).'/private/smartfashion-api',
    ];

    foreach ($candidates as $path) {
        $normalized = str_replace('\\', '/', $path);
        if (is_file($normalized.'/vendor/autoload.php')) {
            return $normalized;
        }
    }

    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'message' => 'Laravel app not found. Upload app to ~/domains/api.smartfashion.site/private/smartfashion-api and run composer install.',
    ]);
    exit;
}

function smartfashion_hostinger_handle_request(): void
{
    $appRoot = smartfashion_hostinger_app_root();

    if (file_exists($maintenance = $appRoot.'/storage/framework/maintenance.php')) {
        require $maintenance;
    }

    require $appRoot.'/vendor/autoload.php';

    $app = require_once $appRoot.'/bootstrap/app.php';

    $app->handleRequest(Illuminate\Http\Request::capture());
}

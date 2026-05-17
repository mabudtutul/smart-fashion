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

/**
 * Hostinger public_html/api/index.php strips the /api URL prefix from PATH_INFO.
 * Laravel registers API routes as /api/v1/* — rewrite the path before routing.
 */
function smartfashion_normalize_api_request_uri(): void
{
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH) ?? '/';
    $path = '/'.trim($path, '/');
    if ($path === '/') {
        return;
    }

    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $fromApiFrontController = str_contains($scriptName, '/api/index.php')
        || str_contains($scriptName, '/api/');

    $needsApiPrefix = $fromApiFrontController
        && preg_match('#^/v1(?:/|$)#', $path)
        && ! str_starts_with($path, '/api/');

    if (! $needsApiPrefix) {
        return;
    }

    $query = parse_url($uri, PHP_URL_QUERY);
    $fixedPath = '/api'.$path;
    $_SERVER['REQUEST_URI'] = $fixedPath.($query ? '?'.$query : '');

    if (isset($_SERVER['PATH_INFO']) && is_string($_SERVER['PATH_INFO'])) {
        $pathInfo = '/'.trim($_SERVER['PATH_INFO'], '/');
        if (preg_match('#^/v1(?:/|$)#', $pathInfo)) {
            $_SERVER['PATH_INFO'] = '/api'.$pathInfo;
        }
    }
}

function smartfashion_hostinger_handle_request(): void
{
    $appRoot = smartfashion_hostinger_app_root();

    if (file_exists($maintenance = $appRoot.'/storage/framework/maintenance.php')) {
        require $maintenance;
    }

    require $appRoot.'/vendor/autoload.php';

    smartfashion_normalize_api_request_uri();

    $app = require_once $appRoot.'/bootstrap/app.php';

    $app->handleRequest(Illuminate\Http\Request::capture());
}

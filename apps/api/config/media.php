<?php

return [
    /*
    | Hostinger: set UPLOADS_ROOT to ~/domains/.../public_html/uploads
    | (or symlink public/uploads → public_html/uploads in deploy script).
    */
    'uploads_root' => env('UPLOADS_ROOT'),

    'max_upload_kb' => (int) env('MEDIA_MAX_UPLOAD_KB', 8192),
    'max_edge_px' => (int) env('MEDIA_MAX_EDGE_PX', 4000),
    'min_edge_px' => (int) env('MEDIA_MIN_EDGE_PX', 80),
    'webp_quality' => (int) env('MEDIA_WEBP_QUALITY', 80),

    'products' => [
        'main' => ['width' => 1200, 'height' => 1200],
        'card' => ['width' => 600, 'height' => 600],
        'thumb' => ['width' => 150, 'height' => 150],
    ],

    'categories' => [
        'banner' => ['width' => 600, 'height' => 600],
        'thumb' => ['width' => 300, 'height' => 300],
    ],

    'hero' => [
        'desktop' => ['width' => 1920, 'height' => 720],
        'mobile' => ['width' => 828, 'height' => 960],
    ],

    'homepage_banners' => [
        'main' => ['width' => 960, 'height' => 480],
    ],
];

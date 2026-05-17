<?php

/**
 * Front controller when /api/* is served from public_html/api/ (Hostinger subdirectory).
 * Copy to: public_html/api/index.php
 * Also copy hostinger-bootstrap.php to public_html/api/hostinger-bootstrap.php
 */
define('LARAVEL_START', microtime(true));

require __DIR__.'/hostinger-bootstrap.php';

smartfashion_hostinger_handle_request();

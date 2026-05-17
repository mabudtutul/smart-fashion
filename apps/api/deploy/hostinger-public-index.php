<?php

define('LARAVEL_START', microtime(true));

require __DIR__.'/hostinger-bootstrap.php';

smartfashion_hostinger_handle_request();

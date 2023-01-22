<?php
error_reporting(E_ALL & ~E_DEPRECATED);

require __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/TodoController.php';

use Pecee\SimpleRouter\SimpleRouter;

/* Load external routes file */
require_once __DIR__ . '/../core/routes.php';

/**
 * The default namespace for route-callbacks, so we don't have to specify it each time.
 * Can be overwritten by using the namespace config option on your routes.
 */


// Start the routing
SimpleRouter::start();

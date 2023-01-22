<?php

require __DIR__ . "/../vendor/autoload.php";

use Illuminate\Database\Capsule\Manager as Capsule;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();
$capsule = new Capsule;

$capsule->addConnection([
    "driver" => $_ENV['DB_DRIVER'] ?? "mysql",
    "host" => $_ENV['DB_HOST'],
    "database" => $_ENV['DB_NAME'],
    "username" => $_ENV['DB_USER'],
    "password" => $_ENV['DB_PASSWORD']
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

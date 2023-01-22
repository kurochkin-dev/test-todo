<?php

require __DIR__ . "/../core/bootstrap.php";

use Illuminate\Database\Capsule\Manager as Capsule;

Capsule::schema()->create('todos', function ($table) {

    $table->increments('id');

    $table->string('username')->nullable();
    $table->string('email')->nullable();;
    $table->string('description')->nullable();;
    $table->enum('status', ['TO_DO', 'DOING', 'DONE'])->default('TO_DO');

    $table->timestamps();

});

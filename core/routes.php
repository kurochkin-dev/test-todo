<?php

require_once 'bootstrap.php';
require_once __DIR__ . '/../classes/ToDo.php';
require_once __DIR__ . '/../classes/User.php';

use Pecee\SimpleRouter\SimpleRouter;


SimpleRouter::get('/api', function() {
    return 'Hello world!';
});

SimpleRouter::post('/api/auth', 'AuthController@auth');

SimpleRouter::group(['prefix' => '/api/todo'], function () {
    SimpleRouter::get('/', 'TodoController@get');
    SimpleRouter::put('/', 'TodoController@put');
    SimpleRouter::put('/{id}', 'TodoController@getOne');
    SimpleRouter::delete('/{id}', 'TodoController@delete');
    SimpleRouter::patch('/{id}', 'TodoController@patch');
});

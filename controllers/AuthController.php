<?php

class AuthController
{
    public function auth() {
        $data = json_decode(file_get_contents('php://input'), true);
        if ($data['username'] !== $_ENV['ADMIN_USER'] ||  $data['password'] !== $_ENV['ADMIN_PASSWORD']) {
            return "{ \"error\": 'Unauthorized' }";
        }
        return "{ \"token\": \"{$_ENV['TOKEN']}\" }";
    }
}

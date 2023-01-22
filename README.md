# To Do app on PHP and JS without frameworks

## Requirements
- composer: https://getcomposer.org/
- **mysql**/mariadb/**postgres**
- php version `^7.4 || ^8.0`
- http server with .htaccess and mod_rewrite support

## Getting started
1. Create database and user (**mysql** and **postgres** are supported) and set it in `.env`, optionally configure admin user:
```
TOKEN=admin
ADMIN_USER=admin
ADMIN_PASSWORD=123

DB_USER=root
DB_PASSWORD=
DB_NAME=todo
DB_HOST=127.0.0.1
DB_DRIVER=mysql
```
2. Install `composer` from https://getcomposer.org/ and run:
```bash
composer install
```

3. Go to `/database/ToDo.php` in your browser to create table

## Directories

- **api** - api loader with `.htaccess`
- **classes** - `models` directory
- **controllers** - controllers directory
- **controllers**/`AuthController.php` - authorisation controller for `/api/auth` endpoints
- **controllers**/`TodoController.php` - controller for Todo entities and `/api/todo` endpoints
- **core**/`bootstrap.php` - app initialization file
- **core**`/routes.php` - `pecee/simple-router` endpoints listed here
- **css** - custom css here
- **database**/`ToDo.php` - run this for database initialization
- **js** - front-end with vanilla js here (TODO: split ot files)
- **postman** - postman collections and environments
- `.env.example` - `.env` configuration file example. Copy it to .env

## TODO:
- create user entity and password authorization
- separate front-end for different files
- js constants
- add `swagger` and docs
- implement JS build (webpack)
- implement backend in `nestjs`/`expressjs`/`laravel`
- implement frontend in `reactjs`/`nextjs`

<?php

//namespace app\controllers;

class TodoController
{
    public function get()
    {
        $orderBy = $_GET['orderBy'] ?? 'id_desc';
        $offset = $_GET['offset'] ?? 0;
        $limit = $_GET['limit'] ?? 3;
        [$by, $order] = explode('_', $orderBy);

        return json_encode([
            'items' => Todo::where([])
                ->skip($offset * $limit)
                ->take($limit)
                ->orderBy($by, $order)
                ->get(),
            'total' => Todo::count(),
        ]);
    }

    public function put() {
        $data = json_decode(file_get_contents('php://input'), true);
        return json_encode(Todo::Create([...$data]));
    }
    public function getOne($todo_id) {
        return Todo::find($todo_id);
    }

    public function patch($todo_id) {
        $headers = getallheaders();
        if ($headers["Authorization-Token"] !== $_ENV['TOKEN']) {
            return json_encode(['error' => 'invalid token']);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        return Todo::find($todo_id)->update($data);
    }

    public function delete($todo_id) {
        $headers = getallheaders();
        if ($headers["Authorization-Token"] !== $_ENV['TOKEN']) {
            return json_encode(['error' => 'invalid token']);
        }
        return Todo::find($todo_id)->delete();
    }
}

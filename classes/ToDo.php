<?php

use Illuminate\Database\Eloquent\Model as Eloquent;

class Todo extends Eloquent
{
    protected $fillable = ['username', 'email', 'description', 'status'];
}

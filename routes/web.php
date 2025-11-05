<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Apex E-Commerce API is up and running.'
    ]);
});

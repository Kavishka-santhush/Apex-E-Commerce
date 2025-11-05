<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Seller\SellerController;
use App\Http\Middleware\RoleMiddleware;

Route::middleware('cors')->group(function () {
    // Auth
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware(['auth:api'])->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/profile', [AuthController::class, 'profile']);

        // Products (admin only)
        Route::middleware([RoleMiddleware::class . ':admin'])->group(function () {
            Route::post('products', [ProductController::class, 'store']);
            Route::put('products/{id}', [ProductController::class, 'update']);
            Route::delete('products/{id}', [ProductController::class, 'destroy']);
        });

        // Orders
        Route::get('orders', [OrderController::class, 'index']);
        Route::get('orders/{id}', [OrderController::class, 'show']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::post('orders/{order}/pay', [OrderController::class, 'pay']);

        // Stripe Payment
        Route::post('payment/create-checkout-session', [PaymentController::class, 'createCheckoutSession']);

        // Admin Routes
        Route::middleware([RoleMiddleware::class . ':admin'])->prefix('admin')->group(function () {
            Route::get('dashboard', [AdminController::class, 'dashboard']);
            Route::get('users', [AdminController::class, 'getUsers']);
            Route::put('users/{id}/role', [AdminController::class, 'updateUserRole']);
            Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
            Route::get('products', [AdminController::class, 'getAllProducts']);
            Route::put('products/{id}', [AdminController::class, 'updateProduct']);
            Route::delete('products/{id}', [AdminController::class, 'deleteProduct']);
            Route::get('orders', [AdminController::class, 'getAllOrders']);
            Route::put('orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
        });

        // Seller Routes
        Route::middleware([RoleMiddleware::class . ':seller,admin'])->prefix('seller')->group(function () {
            Route::get('dashboard', [SellerController::class, 'dashboard']);
            Route::get('products', [SellerController::class, 'getProducts']);
            Route::post('products', [SellerController::class, 'createProduct']);
            Route::put('products/{id}', [SellerController::class, 'updateProduct']);
            Route::delete('products/{id}', [SellerController::class, 'deleteProduct']);
            Route::get('sales', [SellerController::class, 'getSales']);
        });
    });

    // Public product routes
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{id}', [ProductController::class, 'show']);

    // Stripe Webhook (no auth required)
    Route::post('payment/webhook', [PaymentController::class, 'webhook']);
});

<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ProductAdminController;
use App\Http\Controllers\Api\Admin\QuoteAdminController;
use App\Http\Controllers\Api\Admin\CategoryAdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
*/
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/quick-specs', [ProductController::class, 'quickSpecs']);
    Route::get('/{identifier}', [ProductController::class, 'show']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

Route::post('/quote-requests', [QuoteRequestController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Authentication Routes (JWT)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected Admin CMS Routes (JWT Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->prefix('admin')->group(function () {
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Products Management
    Route::post('/products/upload-images', [ProductAdminController::class, 'uploadImages']);
    Route::apiResource('products', ProductAdminController::class);

    // Categories Management
    Route::apiResource('categories', CategoryAdminController::class);

    // Quote Requests Management
    Route::apiResource('quotes', QuoteAdminController::class);
    Route::patch('/quotes/{id}/status', [QuoteAdminController::class, 'updateStatus']);
});

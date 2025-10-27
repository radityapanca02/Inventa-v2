<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AlatBahanController;
use App\Http\Controllers\PeminjamController;
use App\Http\Controllers\TransaksiController;

Route::get('/test', function (Request $request) {
    return response()->json([
        'message' => 'INVENTA API is working!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    Route::apiResource('alat-bahan', AlatBahanController::class);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('peminjam', PeminjamController::class);
    Route::get('/peminjam-with-stats', [PeminjamController::class, 'withStats']);

    Route::apiResource('transaksi', TransaksiController::class);
    Route::post('/transaksi/{id}/return', [TransaksiController::class, 'returnItem']);
    Route::get('/transaksi-active', [TransaksiController::class, 'activeTransactions']);
});
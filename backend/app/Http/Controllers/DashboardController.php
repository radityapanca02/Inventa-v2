<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            // Basic counts
            $totalAlat = \App\Models\AlatBahan::where('jenis', 'alat')->count();
            $totalBahan = \App\Models\AlatBahan::where('jenis', 'bahan')->count();
            $totalPeminjam = \App\Models\Peminjam::count();

            // Stock information
            $totalStockAlat = \App\Models\AlatBahan::where('jenis', 'alat')->sum('jumlah');
            $totalStockBahan = \App\Models\AlatBahan::where('jenis', 'bahan')->sum('jumlah');

            // Items that need attention (low stock or bad condition)
            $itemsPerhatian = \App\Models\AlatBahan::where('kondisi', 'rusak')
                ->orWhere('kondisi', 'hilang')
                ->orWhere('jumlah', '<=', 2)
                ->count();

            // Active transactions (pinjam status)
            $peminjamanAktif = \App\Models\Transaksi::where('status', 'pinjam')->count();

            // Recent activities from transactions
            $recentActivities = \App\Models\Transaksi::with(['peminjam', 'alatBahan'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($transaksi) {
                    $actionType = $transaksi->status === 'pinjam' ? 'pinjam' :
                        ($transaksi->status === 'kembali' ? 'kembali' : 'selesai');

                    return [
                        'id' => $transaksi->id_transaksi,
                        'type' => $actionType,
                        'item' => $transaksi->alatBahan->nama_alat,
                        'user' => $transaksi->peminjam->Nama_peminjam,
                        'time' => $transaksi->created_at->diffForHumans(),
                        'status' => $transaksi->status === 'pinjam' ? 'warning' : 'success'
                    ];
                });

            // Monthly trend data (example for current month vs previous month)
            $currentMonth = now()->month;
            $previousMonth = now()->subMonth()->month;

            $currentMonthTransactions = \App\Models\Transaksi::whereMonth('created_at', $currentMonth)->count();
            $previousMonthTransactions = \App\Models\Transaksi::whereMonth('created_at', $previousMonth)->count();

            $trendPercentage = $previousMonthTransactions > 0
                ? (($currentMonthTransactions - $previousMonthTransactions) / $previousMonthTransactions) * 100
                : 0;

            // Items distribution by condition
            $kondisiDistribution = [
                'baik' => \App\Models\AlatBahan::where('kondisi', 'baik')->count(),
                'rusak' => \App\Models\AlatBahan::where('kondisi', 'rusak')->count(),
                'hilang' => \App\Models\AlatBahan::where('kondisi', 'hilang')->count(),
            ];

            // Popular items (most borrowed)
            $popularItems = \App\Models\Transaksi::select('id_alat', \DB::raw('COUNT(*) as total_pinjam'))
                ->groupBy('id_alat')
                ->orderBy('total_pinjam', 'desc')
                ->with('alatBahan')
                ->limit(3)
                ->get()
                ->map(function ($item) {
                    return [
                        'nama' => $item->alatBahan->nama_alat,
                        'total_pinjam' => $item->total_pinjam,
                        'jenis' => $item->alatBahan->jenis
                    ];
                });

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_alat' => $totalAlat,
                    'total_bahan' => $totalBahan,
                    'peminjaman_aktif' => $peminjamanAktif,
                    'total_peminjam' => $totalPeminjam,
                    'total_stock_alat' => $totalStockAlat,
                    'total_stock_bahan' => $totalStockBahan,
                    'items_perhatian' => $itemsPerhatian,
                ],
                'trends' => [
                    'percentage' => round($trendPercentage, 1),
                    'current_month' => $currentMonthTransactions,
                    'previous_month' => $previousMonthTransactions,
                ],
                'distribution' => $kondisiDistribution,
                'popular_items' => $popularItems,
                'recent_activities' => $recentActivities,
                'timestamp' => now()
            ]);

        } catch (\Exception $e) {
            \Log::error('Dashboard error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error loading dashboard data',
                'error' => env('APP_DEBUG') ? $e->getMessage() : 'Internal server error',
                'stats' => [
                    'total_alat' => 0,
                    'total_bahan' => 0,
                    'peminjaman_aktif' => 0,
                    'total_peminjam' => 0,
                    'total_stock_alat' => 0,
                    'total_stock_bahan' => 0,
                    'items_perhatian' => 0,
                ],
                'trends' => [
                    'percentage' => 0,
                    'current_month' => 0,
                    'previous_month' => 0,
                ],
                'distribution' => ['baik' => 0, 'rusak' => 0, 'hilang' => 0],
                'popular_items' => [],
                'recent_activities' => [],
            ], 500);
        }
    }
}

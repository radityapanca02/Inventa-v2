<?php

namespace App\Http\Controllers;

use App\Models\Peminjam;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PeminjamController extends Controller
{
    public function index()
    {
        $peminjam = Peminjam::all();
        
        return response()->json([
            'success' => true,
            'data' => $peminjam
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_peminjam' => 'required|string|max:100',
            'kontak' => 'required|string|max:20',
            'alasan' => 'required|string|max:255'
        ]);

        $peminjam = Peminjam::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data peminjam berhasil ditambahkan',
            'data' => $peminjam
        ], 201);
    }

    public function show($id)
    {
        $peminjam = Peminjam::find($id);

        if (!$peminjam) {
            return response()->json([
                'success' => false,
                'message' => 'Data peminjam tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $peminjam
        ]);
    }

    public function update(Request $request, $id)
    {
        $peminjam = Peminjam::find($id);

        if (!$peminjam) {
            return response()->json([
                'success' => false,
                'message' => 'Data peminjam tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nama_peminjam' => 'required|string|max:100',
            'kontak' => 'required|string|max:20',
            'alasan' => 'required|string|max:255'
        ]);

        $peminjam->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data peminjam berhasil diperbarui',
            'data' => $peminjam
        ]);
    }

    public function destroy($id)
    {
        $peminjam = Peminjam::find($id);

        if (!$peminjam) {
            return response()->json([
                'success' => false,
                'message' => 'Data peminjam tidak ditemukan'
            ], 404);
        }

        if ($peminjam->transaksis()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus peminjam yang memiliki riwayat transaksi'
            ], 422);
        }

        $peminjam->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data peminjam berhasil dihapus'
        ]);
    }

    public function withStats()
    {
        $peminjam = Peminjam::withCount(['transaksis as total_peminjaman'])
            ->with(['transaksis' => function($query) {
                $query->where('status', 'pinjam');
            }])
            ->get()
            ->map(function($peminjam) {
                return [
                    'id_peminjam' => $peminjam->id_peminjam,
                    'nama_peminjam' => $peminjam->nama_peminjam,
                    'kontak' => $peminjam->kontak,
                    'alasan' => $peminjam->alasan,
                    'total_peminjaman' => $peminjam->total_peminjaman,
                    'peminjaman_aktif' => $peminjam->transaksis->count(),
                    'created_at' => $peminjam->created_at,
                    'updated_at' => $peminjam->updated_at
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $peminjam
        ]);
    }
}
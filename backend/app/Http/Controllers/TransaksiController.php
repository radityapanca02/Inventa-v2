<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\AlatBahan;
use App\Models\Peminjam;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksis = Transaksi::with(['peminjam', 'alatBahan'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transaksis
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_peminjam' => 'required|exists:peminjam,id_peminjam',
            'id_alat' => 'required|exists:alat_bahan,id_alat',
            'jumlah_pinjam' => 'required|integer|min:1',
            'tgl_pinjam' => 'required|date',
            'tgl_kembali' => 'nullable|date|after_or_equal:tgl_pinjam'
        ]);

        // Check stock availability
        $alatBahan = AlatBahan::find($validated['id_alat']);
        if ($alatBahan->jumlah < $validated['jumlah_pinjam']) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $alatBahan->jumlah
            ], 422);
        }

        // Determine status based on item type
        $status = $alatBahan->jenis === 'alat' ? 'pinjam' : 'habis';

        // For tools, return date is required
        if ($alatBahan->jenis === 'alat' && empty($validated['tgl_kembali'])) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal kembali wajib diisi untuk peminjaman alat'
            ], 422);
        }

        // For materials, no return date and status is 'habis'
        if ($alatBahan->jenis === 'bahan') {
            $validated['tgl_kembali'] = null;
            $status = 'habis';
        }

        // Reduce stock for materials immediately
        if ($alatBahan->jenis === 'bahan') {
            $alatBahan->jumlah -= $validated['jumlah_pinjam'];
            $alatBahan->save();
        }

        $transaksi = Transaksi::create([
            ...$validated,
            'status' => $status
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat',
            'data' => $transaksi->load(['peminjam', 'alatBahan'])
        ], 201);
    }

    public function show($id)
    {
        $transaksi = Transaksi::with(['peminjam', 'alatBahan'])->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaksi
        ]);
    }

    public function update(Request $request, $id)
{
    $transaksi = Transaksi::with(['alatBahan'])->find($id);

    if (!$transaksi) {
        return response()->json([
            'success' => false,
            'message' => 'Transaksi tidak ditemukan'
        ], 404);
    }

    // Prevent editing for consumed materials (bahan with status habis)
    if ($transaksi->alatBahan->jenis === 'bahan' && $transaksi->status === 'habis') {
        return response()->json([
            'success' => false,
            'message' => 'Transaksi bahan yang sudah digunakan tidak dapat diubah'
        ], 422);
    }

    $validated = $request->validate([
        'id_peminjam' => 'required|exists:peminjam,id_peminjam',
        'id_alat' => 'required|exists:alat_bahan,id_alat',
        'jumlah_pinjam' => 'required|integer|min:1',
        'tgl_pinjam' => 'required|date',
        'tgl_kembali' => 'nullable|date|after_or_equal:tgl_pinjam',
        'status' => ['required', Rule::in(['pinjam', 'kembali', 'habis'])]
    ]);

    // Prevent changing item type in transaction
    if ($transaksi->id_alat != $validated['id_alat']) {
        $newAlatBahan = AlatBahan::find($validated['id_alat']);
        
        // Validate business rules for new item
        if ($transaksi->alatBahan->jenis !== $newAlatBahan->jenis) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat mengubah jenis item dalam transaksi'
            ], 422);
        }

        // Check stock for new item
        if ($newAlatBahan->jumlah < $validated['jumlah_pinjam'] && $newAlatBahan->jenis === 'bahan') {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $newAlatBahan->jumlah
            ], 422);
        }

        // Restore stock from old item if it was bahan and not consumed
        if ($transaksi->alatBahan->jenis === 'bahan' && $transaksi->status === 'pinjam') {
            $transaksi->alatBahan->jumlah += $transaksi->jumlah_pinjam;
            $transaksi->alatBahan->save();
        }

        // Reduce stock for new bahan item
        if ($newAlatBahan->jenis === 'bahan' && $validated['status'] === 'pinjam') {
            $newAlatBahan->jumlah -= $validated['jumlah_pinjam'];
            $newAlatBahan->save();
        }
    } else {
        // Same item, handle stock changes for bahan
        if ($transaksi->alatBahan->jenis === 'bahan') {
            $stockDifference = $transaksi->jumlah_pinjam - $validated['jumlah_pinjam'];
            
            if ($stockDifference > 0) {
                // Returning some stock
                $transaksi->alatBahan->jumlah += $stockDifference;
            } else if ($stockDifference < 0) {
                // Need more stock
                $needed = abs($stockDifference);
                if ($transaksi->alatBahan->jumlah < $needed) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok tidak mencukupi untuk menambah jumlah'
                    ], 422);
                }
                $transaksi->alatBahan->jumlah -= $needed;
            }
            $transaksi->alatBahan->save();
        }
    }

    // Validate status changes
    if ($transaksi->alatBahan->jenis === 'bahan') {
        // Bahan can only have 'pinjam' or 'habis' status, and can't change from 'habis'
        if (!in_array($validated['status'], ['pinjam', 'habis'])) {
            return response()->json([
                'success' => false,
                'message' => 'Status untuk bahan hanya boleh "pinjam" atau "habis"'
            ], 422);
        }
        
        // If changing from pinjam to habis, reduce stock
        if ($transaksi->status === 'pinjam' && $validated['status'] === 'habis') {
            $transaksi->alatBahan->jumlah -= $validated['jumlah_pinjam'];
            $transaksi->alatBahan->save();
        }
        
        // Bahan shouldn't have return date
        $validated['tgl_kembali'] = null;
    } else {
        // Alat validation
        if ($validated['status'] === 'kembali' && empty($validated['tgl_kembali'])) {
            $validated['tgl_kembali'] = Carbon::now();
        }
    }

    $transaksi->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'Transaksi berhasil diperbarui',
        'data' => $transaksi->load(['peminjam', 'alatBahan'])
    ]);
}

public function returnItem($id)
{
    $transaksi = Transaksi::with(['alatBahan'])->find($id);

    if (!$transaksi) {
        return response()->json([
            'success' => false,
            'message' => 'Transaksi tidak ditemukan'
        ], 404);
    }

    if ($transaksi->status !== 'pinjam') {
        return response()->json([
            'success' => false,
            'message' => 'Hanya transaksi dengan status "pinjam" yang dapat dikembalikan'
        ], 422);
    }

    if ($transaksi->alatBahan->jenis !== 'alat') {
        return response()->json([
            'success' => false,
            'message' => 'Hanya alat yang dapat dikembalikan. Bahan bersifat consumable.'
        ], 422);
    }

    $transaksi->update([
        'status' => 'kembali',
        'tgl_kembali' => Carbon::now()
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Alat berhasil dikembalikan',
        'data' => $transaksi->load(['peminjam', 'alatBahan'])
    ]);
}

    public function destroy($id)
    {
        $transaksi = Transaksi::with(['alatBahan'])->find($id);

        if (!$transaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi tidak ditemukan'
            ], 404);
        }

        // Restore stock if it was bahan that was consumed
        if ($transaksi->alatBahan->jenis === 'bahan' && $transaksi->status === 'habis') {
            $transaksi->alatBahan->jumlah += $transaksi->jumlah_pinjam;
            $transaksi->alatBahan->save();
        }

        $transaksi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus'
        ]);
    }

    public function activeTransactions()
    {
        $transaksis = Transaksi::with(['peminjam', 'alatBahan'])
            ->where('status', 'pinjam')
            ->orderBy('tgl_pinjam', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $transaksis
        ]);
    }
}
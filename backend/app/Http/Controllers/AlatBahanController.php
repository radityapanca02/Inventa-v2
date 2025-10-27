<?php

namespace App\Http\Controllers;

use App\Models\AlatBahan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AlatBahanController extends Controller
{
    public function index()
    {
        $alatBahan = AlatBahan::all();
        
        return response()->json([
            'success' => true,
            'data' => $alatBahan
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_alat' => 'required|string|max:100',
            'jenis' => ['required', Rule::in(['alat', 'bahan'])],
            'kondisi' => ['required', Rule::in(['baik', 'rusak', 'hilang'])],
            'jumlah' => 'required|integer|min:0'
        ]);

        $alatBahan = AlatBahan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Alat/Bahan berhasil ditambahkan',
            'data' => $alatBahan
        ], 201);
    }

    public function show($id)
    {
        $alatBahan = AlatBahan::find($id);

        if (!$alatBahan) {
            return response()->json([
                'success' => false,
                'message' => 'Alat/Bahan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $alatBahan
        ]);
    }

    public function update(Request $request, $id)
    {
        $alatBahan = AlatBahan::find($id);

        if (!$alatBahan) {
            return response()->json([
                'success' => false,
                'message' => 'Alat/Bahan tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'nama_alat' => 'required|string|max:100',
            'jenis' => ['required', Rule::in(['alat', 'bahan'])],
            'kondisi' => ['required', Rule::in(['baik', 'rusak', 'hilang'])],
            'jumlah' => 'required|integer|min:0'
        ]);

        $alatBahan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Alat/Bahan berhasil diperbarui',
            'data' => $alatBahan
        ]);
    }

    public function destroy($id)
    {
        $alatBahan = AlatBahan::find($id);

        if (!$alatBahan) {
            return response()->json([
                'success' => false,
                'message' => 'Alat/Bahan tidak ditemukan'
            ], 404);
        }

        $alatBahan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alat/Bahan berhasil dihapus'
        ]);
    }
}
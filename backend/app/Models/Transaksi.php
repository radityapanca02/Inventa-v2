<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    protected $table = 'transaksi';
    protected $primaryKey = 'id_transaksi';

    protected $fillable = [
        'id_peminjam',
        'id_alat',
        'jumlah_pinjam',
        'tgl_pinjam',
        'tgl_kembali',
        'status'
    ];

    protected $casts = [
        'tgl_pinjam' => 'date',
        'tgl_kembali' => 'date',
    ];

    public function peminjam()
    {
        return $this->belongsTo(Peminjam::class, 'id_peminjam');
    }

    public function alatBahan()
    {
        return $this->belongsTo(AlatBahan::class, 'id_alat');
    }
}
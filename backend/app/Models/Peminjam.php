<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peminjam extends Model
{
    use HasFactory;

    protected $table = 'peminjam';
    protected $primaryKey = 'id_peminjam';

    protected $fillable = [
        'nama_peminjam',
        'kontak',
        'alasan'
    ];

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class, 'id_peminjam');
    }
}
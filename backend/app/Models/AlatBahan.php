<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AlatBahan extends Model
{
    use HasFactory;

    protected $table = 'alat_bahan';
    protected $primaryKey = 'id_alat';

    protected $fillable = [
        'nama_alat',
        'jenis',
        'kondisi',
        'jumlah'
    ];

    protected $casts = [
        'jumlah' => 'integer'
    ];

    public function transaksis()
    {
        return $this->hasMany(Transaksi::class, 'id_alat');
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id('id_transaksi');
            $table->foreignId('id_peminjam')->constrained('peminjam', 'id_peminjam')->onDelete('cascade');
            $table->foreignId('id_alat')->constrained('alat_bahan', 'id_alat')->onDelete('cascade');
            $table->integer('jumlah_pinjam');
            $table->date('tgl_pinjam');
            $table->date('tgl_kembali')->nullable();
            $table->enum('status', ['pinjam', 'kembali', 'habis']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('transaksi');
    }
};
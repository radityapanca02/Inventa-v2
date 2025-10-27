<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alat_bahan', function (Blueprint $table) {
            $table->id('id_alat');
            $table->string('nama_alat', 100);
            $table->enum('jenis', ['alat', 'bahan']);
            $table->enum('kondisi', ['baik', 'rusak', 'hilang']);
            $table->integer('jumlah');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('alat_bahan');
    }
};
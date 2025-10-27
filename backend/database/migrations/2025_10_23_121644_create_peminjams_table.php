<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('peminjam', function (Blueprint $table) {
            $table->id('id_peminjam');
            $table->string('nama_peminjam', 100);
            $table->string('kontak', 20);
            $table->string('alasan', 255);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('peminjam');
    }
};
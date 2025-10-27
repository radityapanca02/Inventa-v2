# INVENTA ✨🎨

**Sistem Manajemen Peminjaman Alat dan Bahan Prakarya Ekstrakurikuler Sekolah**

![INVENTA Animation](https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif)

---

## 🧭 Tentang Project

**INVENTA** adalah sistem manajemen digital yang dirancang untuk mempermudah sekolah dalam mengelola peminjaman alat dan bahan prakarya. Sistem ini menggabungkan **desain modern**, **fitur otomatisasi**, dan **analitik data** agar proses inventaris menjadi lebih cepat, efisien, dan transparan.

---

## 🪄 Fitur Utama

* 🧰 **Manajemen Inventaris** – Kelola data alat & bahan prakarya dengan mudah.
* 🔄 **Sistem Peminjaman** – Pencatatan peminjaman dan pengembalian otomatis.
* 👩‍🏫 **Data Peminjam** – Informasi siswa/guru lengkap dengan riwayat transaksi.
* 📈 **Dashboard Analytics** – Visualisasi statistik inventaris dan aktivitas peminjaman.
* 🔐 **Authentication System** – Login dan role management yang aman.

![Dashboard Preview](https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif)

---

## ⚙️ Teknologi yang Digunakan

### Frontend

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge\&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge\&logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge\&logo=javascript)

### Backend

![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge\&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge\&logo=php)

### Database

![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge\&logo=mysql)

---

## 🧩 ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    USERS ||--o{ TRANSAKSI : melakukan
    PEMINJAM ||--o{ TRANSAKSI : memiliki
    ALAT_BAHAN ||--o{ TRANSAKSI : dipinjam

    USERS {
        int id_users PK
        varchar username
        varchar password
        varchar email
    }

    PEMINJAM {
        int id_peminjam PK
        varchar nama_peminjam
        varchar kontak
        varchar alasan
    }

    ALAT_BAHAN {
        int id_alat PK
        varchar nama_alat
        varchar jenis
        enum kondisi
        int jumlah
    }

    TRANSAKSI {
        int id_transaksi PK
        int id_peminjam FK
        int id_alat FK
        int jumlah_pinjam
        date tgl_pinjam
        date tgl_kembali
        enum status
    }
```

---

## 🧱 Struktur Database (Master Data)

| **Entity**     | **Deskripsi**                         | **Hubungan**           |
| -------------- | ------------------------------------- | ---------------------- |
| **Users**      | Data pengguna sistem (admin, petugas) | 1 : N → Transaksi      |
| **Alat_Bahan** | Master data alat dan bahan prakarya   | 1 : N → Transaksi      |
| **Peminjam**   | Data siswa/guru peminjam              | 1 : N → Transaksi      |
| **Transaksi**  | Catatan peminjaman alat & bahan       | N : 1 → Peminjam, Alat |

![Database Flow](https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif)

---

## 🎨 Desain UI/UX

### Style & Visuals

* 🩵 **Glassmorphism**: Efek transparan dengan bayangan lembut.
* 🌈 **Pastel Color Palette**: Warna lembut yang nyaman untuk mata.
* 📱 **Fully Responsive**: Adaptif di perangkat desktop dan mobile.
* 🧭 **Animated Dashboard**: Statistik interaktif dan grafik real-time.

![UI Animation](https://media.giphy.com/media/d31w24psGYeekCZy/giphy.gif)

---

## 🔧 API Endpoints

### Authentication

```http
POST /api/login
POST /api/register
POST /api/logout
```

### Alat & Bahan

```http
GET /api/alat-bahan
POST /api/alat-bahan
PUT /api/alat-bahan/{id}
DELETE /api/alat-bahan/{id}
```

### Transaksi

```http
GET /api/transaksi
POST /api/transaksi
PUT /api/transaksi/{id}
```

---

## 📊 Statistik & Analytics

| Statistik           | Deskripsi                    |
| ------------------- | ---------------------------- |
| 🔢 Total Alat/Bahan | Jumlah item di inventaris    |
| 🔄 Total Transaksi  | Aktivitas peminjaman/kembali |
| 👥 Jumlah Peminjam  | Data peminjam aktif          |
| ⚙️ Kondisi Barang   | Barang baik / rusak / hilang |

![Stats Animation](https://media.giphy.com/media/xUOxf3Zc8Y8UynK7nO/giphy.gif)

---

## 👥 Tim Pengembang

| Role                    | Nama                             | Kontribusi                      |
| ----------------------- | -------------------------------- | ------------------------------- |
| 💻 Full Stack Developer | Muhammad Panca Raditya Pamungkas | Pengembangan sistem & backend   |
| 🎨 UI/UX Designer       | Muhammad Panca Raditya Pamungkas | Desain visual & user experience |
| 🧠 Database Architect   | Muhammad Panca Raditya Pamungkas | Desain skema database & ERD     |

---

## 📞 Kontak

📧 **[radityapanca02@gmail.com](mailto:radityapanca02@gmail.com)**
🐙 **GitHub:** [radityapanca02/inventa-v2](https://github.com/radityapanca02/inventa-v2)

---

<div align="center">

### ⭐ Jangan lupa beri bintang jika project ini membantu!

> *"Mengelola inventaris sekolah dengan lebih efisien dan modern"*

![Footer Animation](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2Z4d2I1cG5ob2V0Z2R3eGx0Z2N6eGx0c2VjZGZ0bGZ6Z2ZxZ2ZxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif)

</div>

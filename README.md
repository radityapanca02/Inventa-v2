# INVENTA 🎨

**Sistem Manajemen Peminjaman Alat dan Bahan Prakarya Ekstrakurikuler Sekolah**

![INVENTA Dashboard](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2Z4d2I1cG5ob2V0Z2R3eGx0Z2N6eGx0c2VjZGZ0bGZ6Z2ZxZ2ZxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif)

## 📋 Tentang Project

INVENTA adalah sistem manajemen peminjaman alat dan bahan prakarya yang dikembangkan sebagai project tugas akhir. Sistem ini memudahkan sekolah dalam mengelola inventaris alat dan bahan prakarya untuk kegiatan ekstrakurikuler.

### 🎯 Fitur Utama

- ✅ **Manajemen Inventaris** - Kelola alat dan bahan prakarya
- ✅ **Sistem Peminjaman** - Proses peminjaman dan pengembalian
- ✅ **Manajemen Peminjam** - Data siswa dan guru
- ✅ **Dashboard Analytics** - Statistik dan laporan
- ✅ **Authentication System** - Login dan manajemen user

## 🛠️ Teknologi yang Digunakan

### Frontend
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)

### Backend
![Laravel](https://img.shields.io/badge/Laravel-10.x-FF2D20?style=for-the-badge&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?style=for-the-badge&logo=php)

### Database
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)

## 🚀 Quick Start

### Prerequisites

Pastikan Anda telah menginstall:
- Node.js (v16 atau lebih tinggi)
- PHP (v8.1 atau lebih tinggi)
- Composer
- MySQL (v8.0 atau lebih tinggi)

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/radityapanca/inventa-v2.git
cd inventa
```

2. **Backend Setup (Laravel)**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

3. **Database Configuration**
```bash
# Edit file .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventa
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. **Run Migrations**
```bash
php artisan migrate
php artisan db:seed
```

5. **Frontend Setup (React)**
```bash
cd ../frontend
npm install
npm run dev
```

6. **Start Development Servers**
```bash
# Terminal 1 - Backend
cd backend && php artisan serve

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## 📊 Database Schema

### Tabel Users
| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| id_users | int(20) | AUTO, PK |
| username | varchar(100) | Not null |
| password | varchar(255) | Not null |
| email | varchar(50) | Not null |

### Tabel alat_bahan
| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| id_alat | int(20) | AUTO, PK |
| nama_alat | varchar(100) | Not null |
| jenis | varchar(255) | Not null |
| kondisi | ENUM('baik', 'rusak', 'hilang') | Not null |
| jumlah | int(50) | Not null |

### Tabel Peminjam
| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| id_peminjam | int(20) | AUTO, PK |
| Nama_peminjam | varchar(100) | Not null |
| kontak | varchar(20) | Not null |
| alasan | varchar(255) | Not null |

### Tabel Transaksi
| Field | Tipe Data | Keterangan |
|-------|-----------|------------|
| id_transaksi | int(20) | AUTO, PK |
| id_peminjam | int(20) | FK |
| id_alat | int(20) | FK |
| jumlah_pinjam | int(50) | Not null |
| tgl_pinjam | date | Not null |
| tgl_kembali | date | Not null |
| status | ENUM('pinjam', 'kembali') | Not null |

## 🎨 UI/UX Features

### Modern Design Elements
- 🎯 **Floating Dock Navigation** - Navigasi yang elegan dan mudah diakses
- 🍃 **Glassmorphism Effect** - Tampilan modern dengan efek kaca transparan
- 📱 **Fully Responsive** - Optimal di semua perangkat
- 🎨 **Pastel Color Scheme** - Warna yang nyaman dipandang mata

## 🔧 API Endpoints

### Authentication
```http
POST /api/login
POST /api/register
POST /api/logout
```

### Alat & Bahan
```http
GET    /api/alat-bahan
POST   /api/alat-bahan
GET    /api/alat-bahan/{id}
PUT    /api/alat-bahan/{id}
DELETE /api/alat-bahan/{id}
```

### Peminjaman
```http
GET    /api/transaksi
POST   /api/transaksi
GET    /api/transaksi/{id}
PUT    /api/transaksi/{id}
```

## 📸 Screenshots

### Login Page
![Login Page](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Coming+Soon)

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Coming+Soon)

### Manajemen Alat
![Alat Management](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Coming+Soon)

## 🚀 Deployment

### Production Build
```bash
# Build Frontend
cd frontend
npm run build

# Optimize Backend
cd ../backend
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventa
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## 🤝 Contributing

Kami menyambang kontribusi untuk pengembangan INVENTA! 

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Tim Pengembang

| Role | Nama | Kontribusi |
|------|------|------------|
| Full Stack Developer | [Muhammad Panca Raditya Pamungkas] | Pengembangan sistem lengkap |
| UI/UX Designer | [Muhammad Panca Raditya Pamungkas] | Desain interface dan user experience |
| Database Architect | [Muhammad Panca Raditya Pamungkas] | Perancangan database dan optimisasi |

## 📞 Kontak

**Nama Project** - INVENTA  
**Email** - radityapanca02@gmail.com 
**GitHub** - [https://github.com/radityapanca02/inventa-v2](https://github.com/radityapanca02/inventa-v2)

---

<div align="center">

### ⭐ Jangan lupa beri bintang jika project ini membantu!

**"Mengelola inventaris sekolah dengan lebih efisien dan modern"**

</div>

## 🎯 Roadmap

- [x] Basic CRUD Operations
- [x] User Authentication
- [x] Responsive Design
- [ ] Push Notifications
- [ ] Mobile App Version
- [ ] Advanced Reporting
- [ ] Integration with School Systems

---

<div align="center">

**Dibuat dengan tujuan penyelesaian tuntutan Project Tugas Akhir | SMK PGRI 3 Malang**

<!-- ![INVENTA Logo](https://via.placeholder.com/100/4F46E5/FFFFFF?text=INV) -->

</div>
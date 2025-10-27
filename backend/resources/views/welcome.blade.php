<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventa - Platform Manajemen Terbaik</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        
        .floating {
            animation: floating 3s ease-in-out infinite;
        }
        
        @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .bubble {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: rise 15s infinite ease-in;
        }
        
        @keyframes rise {
            0% {
                bottom: -100px;
                opacity: 0;
            }
            50% {
                opacity: 1;
            }
            100% {
                bottom: 100vh;
                opacity: 0;
            }
        }
        
        .btn-glow {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
            transition: all 0.3s ease;
        }
        
        .btn-glow:hover {
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <!-- Bubbles Background -->
    <div class="bubble" style="width: 80px; height: 80px; left: 10%; animation-delay: 0s;"></div>
    <div class="bubble" style="width: 60px; height: 60px; left: 20%; animation-delay: 2s;"></div>
    <div class="bubble" style="width: 100px; height: 100px; left: 35%; animation-delay: 4s;"></div>
    <div class="bubble" style="width: 70px; height: 70px; left: 50%; animation-delay: 1s;"></div>
    <div class="bubble" style="width: 90px; height: 90px; left: 70%; animation-delay: 3s;"></div>
    <div class="bubble" style="width: 50px; height: 50px; left: 85%; animation-delay: 5s;"></div>

    <!-- Floating Dock Navbar -->
    <nav class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div class="glass-card px-6 py-4 rounded-3xl flex items-center space-x-6">
            <a href="/" class="group flex flex-col items-center transition-all duration-300 hover:scale-110">
                <span class="text-3xl mb-1 group-hover:scale-125 transition-transform">🏠</span>
                <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Home</span>
            </a>
            <a href="#features" class="group flex flex-col items-center transition-all duration-300 hover:scale-110">
                <span class="text-3xl mb-1 group-hover:scale-125 transition-transform">✨</span>
                <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Features</span>
            </a>
            <a href="#about" class="group flex flex-col items-center transition-all duration-300 hover:scale-110">
                <span class="text-3xl mb-1 group-hover:scale-125 transition-transform">📦</span>
                <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Inventa</span>
            </a>
            <a href="#docs" class="group flex flex-col items-center transition-all duration-300 hover:scale-110">
                <span class="text-3xl mb-1 group-hover:scale-125 transition-transform">📚</span>
                <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Docs</span>
            </a>
            <a href="#contact" class="group flex flex-col items-center transition-all duration-300 hover:scale-110">
                <span class="text-3xl mb-1 group-hover:scale-125 transition-transform">💬</span>
                <span class="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">Contact</span>
            </a>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
        <div class="grid md:grid-cols-2 gap-8 items-center">
            <!-- Left Side - Welcome Message -->
            <div class="glass-card p-8 rounded-3xl floating">
                <div class="mb-6">
                    <span class="text-6xl">👋</span>
                </div>
                <h1 class="text-5xl font-bold text-white mb-4">
                    Selamat Datang di Inventa!
                </h1>
                <p class="text-white/90 text-xl mb-8 leading-relaxed">
                    Platform manajemen inventory yang powerful dan mudah digunakan. Kelola stok, tracking barang, dan monitoring real-time dengan satu sistem terintegrasi.
                </p>
                <div class="space-y-4 mb-8">
                    <div class="flex items-start space-x-4">
                        <span class="text-3xl">✨</span>
                        <div>
                            <h3 class="text-white font-semibold text-lg">Real-time Monitoring</h3>
                            <p class="text-white/80">Pantau stok barang secara langsung dan akurat</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-4">
                        <span class="text-3xl">🚀</span>
                        <div>
                            <h3 class="text-white font-semibold text-lg">Fast & Efficient</h3>
                            <p class="text-white/80">Sistem cepat dan mudah digunakan untuk semua</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-4">
                        <span class="text-3xl">🔒</span>
                        <div>
                            <h3 class="text-white font-semibold text-lg">Secure & Reliable</h3>
                            <p class="text-white/80">Data aman dengan enkripsi tingkat tinggi</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Info Card -->
            <div class="glass-card p-8 rounded-3xl">
                <div class="mb-6">
                    <span class="text-6xl">🎉</span>
                </div>
                <h2 class="text-3xl font-bold text-white mb-4">
                    Sistem Siap Digunakan!
                </h2>
                <p class="text-white/90 mb-6 text-lg">
                    Backend Laravel telah berhasil disetup. Mulai kelola inventory Anda dengan fitur-fitur lengkap yang tersedia.
                </p>
                
                <div class="space-y-4 mb-6">
                    <div class="glass-card p-5 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <h4 class="text-white font-semibold mb-2 text-lg">📈 Dashboard Analytics</h4>
                        <p class="text-white/80">Visualisasi data dan laporan real-time</p>
                    </div>
                    <div class="glass-card p-5 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <h4 class="text-white font-semibold mb-2 text-lg">📦 Manajemen Produk</h4>
                        <p class="text-white/80">Kelola produk dengan mudah dan cepat</p>
                    </div>
                    <div class="glass-card p-5 rounded-xl hover:bg-white/20 transition-all duration-300">
                        <h4 class="text-white font-semibold mb-2 text-lg">🔄 Auto Sync</h4>
                        <p class="text-white/80">Sinkronisasi otomatis antar device</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="glass-card mx-4 mb-4 p-6 rounded-2xl">
        <div class="container mx-auto text-center text-white/80">
            <p>© 2024 Inventa. Built with ❤️ using Laravel & Tailwind CSS</p>
            <p class="text-sm mt-2">Powered by Laravel Framework</p>
        </div>
    </footer>
</body>
</html>
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  IconPackage, 
  IconUsers, 
  IconClipboardList, 
  IconTrendingUp,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconArrowUpRight,
  IconArrowDownRight,
  IconRefresh,
  IconAlertTriangle,
  IconStar
} from '@tabler/icons-react';
import { showErrorToast } from '../services/sweetAlert';

const DashboardSection = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      total_alat: 0,
      total_bahan: 0,
      peminjaman_aktif: 0,
      total_peminjam: 0,
      total_stock_alat: 0,
      total_stock_bahan: 0,
      items_perhatian: 0
    },
    trends: {
      percentage: 0,
      current_month: 0,
      previous_month: 0
    },
    distribution: {
      baik: 0,
      rusak: 0,
      hilang: 0
    },
    popular_items: [],
    recent_activities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard');
      
      if (response.data.success) {
        setDashboardData(response.data);
      } else {
        throw new Error(response.data.message || 'Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard');
      showErrorToast('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Error State Component
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <IconAlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Gagal Memuat Dashboard</h2>
        <p className="text-gray-600 mb-4 max-w-md">{error}</p>
        <button
          onClick={loadDashboardData}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <IconRefresh className="h-4 w-4" />
          Coba Lagi
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    );
  }

  const { stats, trends, distribution, popular_items, recent_activities } = dashboardData;

  const StatCard = ({ title, value, icon: Icon, trend, description, color = 'blue' }) => {
    const colors = {
      blue: { bg: 'bg-blue-100', icon: 'text-blue-600', trend: 'text-blue-600' },
      green: { bg: 'bg-green-100', icon: 'text-green-600', trend: 'text-green-600' },
      purple: { bg: 'bg-purple-100', icon: 'text-purple-600', trend: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', icon: 'text-orange-600', trend: 'text-orange-600' },
      red: { bg: 'bg-red-100', icon: 'text-red-600', trend: 'text-red-600' },
    };

    const selectedColor = colors[color];

    return (
      <div className="glassmorphism p-6 rounded-2xl hover:scale-105 transition-transform duration-200 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
            {trend !== undefined && (
              <div className={`flex items-center text-sm ${selectedColor.trend}`}>
                {trend > 0 ? <IconArrowUpRight className="h-4 w-4 mr-1" /> : <IconArrowDownRight className="h-4 w-4 mr-1" />}
                <span>{Math.abs(trend)}% dari bulan lalu</span>
              </div>
            )}
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${selectedColor.bg}`}>
            <Icon className={`h-6 w-6 ${selectedColor.icon}`} />
          </div>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getActivityConfig = (type) => {
      const configs = {
        pinjam: { color: 'text-blue-600', bg: 'bg-blue-100', icon: IconClock, text: 'Dipinjam' },
        kembali: { color: 'text-green-600', bg: 'bg-green-100', icon: IconCheck, text: 'Dikembalikan' },
        habis: { color: 'text-orange-600', bg: 'bg-orange-100', icon: IconPackage, text: 'Digunakan' },
        selesai: { color: 'text-purple-600', bg: 'bg-purple-100', icon: IconCheck, text: 'Selesai' },
      };
      return configs[type] || configs.pinjam;
    };

    const config = getActivityConfig(activity.type);
    const Icon = config.icon;

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.item}
          </p>
          <p className="text-sm text-gray-500">
            {config.text} • {activity.user}
          </p>
        </div>
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {activity.time}
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ title, description, icon: Icon, action, color = 'primary' }) => {
    const colors = {
      primary: 'bg-primary-500 hover:bg-primary-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
    };

    return (
      <button
        onClick={action}
        className={`glassmorphism p-6 rounded-2xl text-left hover:scale-105 transition-all duration-200 group w-full shadow-md`}>
        <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </button>
    );
  };

  const PopularItem = ({ item, index }) => {
    const rankColors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-500'];
    
    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
        <div className={`w-6 h-6 rounded-full ${rankColors[index]} flex items-center justify-center text-white text-xs font-bold`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.nama}
          </p>
          <p className="text-sm text-gray-500">
            {item.jenis} • {item.total_pinjam}x dipinjam
          </p>
        </div>
        <IconStar className="h-4 w-4 text-yellow-500" />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Selamat Datang di INVENTA</h1>
        <p className="text-gray-600 text-lg">Sistem Manajemen Peminjaman Alat & Bahan Prakarya</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Total Alat"
              value={stats.total_alat}
              icon={IconPackage}
              trend={12}
              color="blue"
              description={`${stats.total_stock_alat} stok tersedia`}
            />
            <StatCard
              title="Total Bahan"
              value={stats.total_bahan}
              icon={IconPackage}
              trend={8}
              color="green"
              description={`${stats.total_stock_bahan} stok tersedia`}
            />
            <StatCard
              title="Peminjaman Aktif"
              value={stats.peminjaman_aktif}
              icon={IconClipboardList}
              trend={trends.percentage}
              color="purple"
              description={`${trends.current_month} transaksi bulan ini`}
            />
            <StatCard
              title="Total Peminjam"
              value={stats.total_peminjam}
              icon={IconUsers}
              trend={15}
              color="orange"
              description="Pengguna terdaftar"
            />
            <StatCard
              title="Perhatian"
              value={stats.items_perhatian}
              icon={IconAlertTriangle}
              color="red"
              description="Item perlu pengecekan"
            />
            <StatCard
              title="Kondisi Baik"
              value={distribution.baik}
              icon={IconCheck}
              color="green"
              description={`${((distribution.baik / (stats.total_alat + stats.total_bahan)) * 100).toFixed(0)}% dari total`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickActionCard
              title="Kelola Alat & Bahan"
              description="Tambah, edit, atau hapus alat dan bahan prakarya"
              icon={IconPackage}
              action={() => navigate('/alat-bahan')}
              color="green"
            />
            <QuickActionCard
              title="Kelola Peminjam"
              description="Management data peminjam alat dan bahan"
              icon={IconUsers}
              action={() => navigate('/peminjam')}
              color="green"
            />
            <QuickActionCard
              title="Buat Transaksi"
              description="Proses peminjaman dan pengembalian barang"
              icon={IconClipboardList}
              action={() => navigate('/transaksi')}
              color="purple"
            />
            <QuickActionCard
              title="Lihat Laporan"
              description="Analisis dan statistik peminjaman"
              icon={IconTrendingUp}
              action={() => console.log('Laporan clicked')}
              color="orange"
            />
          </div>
        </div>

        {/* Right Column - Activity & Summary */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
              <IconClipboardList className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recent_activities.length > 0 ? (
                recent_activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <IconClock className="h-8 w-8 mx-auto mb-2" />
                  <p>Belum ada aktivitas</p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Items */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Item Populer</h2>
              <IconStar className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-2">
              {popular_items.length > 0 ? (
                popular_items.map((item, index) => (
                  <PopularItem key={index} item={item} index={index} />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <IconPackage className="h-8 w-8 mx-auto mb-2" />
                  <p>Belum ada data popular</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="glassmorphism p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Items</span>
                <span className="text-sm font-medium text-gray-800">
                  {stats.total_alat + stats.total_bahan}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Kondisi Baik</span>
                <span className="flex items-center text-sm text-green-600">
                  {distribution.baik} items
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Perlu Perhatian</span>
                <span className="flex items-center text-sm text-red-600">
                  <IconAlertTriangle className="h-4 w-4 mr-1" />
                  {stats.items_perhatian} items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Kondisi</h2>
          <div className="space-y-3">
            {Object.entries(distribution).map(([kondisi, count]) => (
              <div key={kondisi} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{kondisi}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        kondisi === 'baik' ? 'bg-green-500' : 
                        kondisi === 'rusak' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${(count / (stats.total_alat + stats.total_bahan)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glassmorphism p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Stok Alat Bahan</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg shadow-xs">
              <IconPackage className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.total_stock_alat}</div>
              <div className="text-xs text-blue-600">Stok Alat</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg shadow-xs">
              <IconPackage className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.total_stock_bahan}</div>
              <div className="text-xs text-green-600">Stok Bahan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
import { useState, useEffect } from 'react';
import { transaksiService } from '../services/api';
import TransaksiTable from '../components/tables/TransaksiTable';
import TransaksiForm from '../components/forms/TransaksiForm';
import {
  IconPlus,
  IconClipboardList,
  IconClock,
  IconCheck,
  IconPackage,
  IconRefresh
} from '@tabler/icons-react';
import {
  showSuccessToast,
  showErrorToast,
  showDeleteConfirm,
  showConfirm,
  showLoading,
  closeAlert
} from '../services/sweetAlert';

const Transaksi = () => {
  const [transaksis, setTransaksis] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'returned', 'consumed'
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);

  useEffect(() => {
    loadTransaksis();
  }, []);

  const loadTransaksis = async () => {
    try {
      setLoading(true);
      const response = await transaksiService.getAll();
      setTransaksis(response.data);
    } catch (error) {
      console.error('Error loading transaksis:', error);
      showErrorToast('Gagal memuat data transaksi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    // Prevent editing consumed materials
    if (item.alat_bahan?.jenis === 'bahan' && item.status === 'habis') {
      showErrorToast('Bahan yang sudah digunakan tidak dapat diubah');
      return;
    }
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    const result = await showDeleteConfirm(`transaksi ${item.alat_bahan?.nama_alat}`);

    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await transaksiService.delete(item.id_transaksi);
        await loadTransaksis();
        showSuccessToast('Transaksi berhasil dihapus');
      } catch (error) {
        console.error('Error deleting transaksi:', error);
        const errorMessage = error.response?.data?.message || 'Gagal menghapus transaksi';
        showErrorToast(errorMessage);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleReturn = async (item) => {
    // Validate if it's a tool and still borrowed
    if (item.alat_bahan?.jenis !== 'alat') {
      showErrorToast('Hanya alat yang dapat dikembalikan');
      return;
    }

    if (item.status !== 'pinjam') {
      showErrorToast('Hanya transaksi dengan status "pinjam" yang dapat dikembalikan');
      return;
    }

    const result = await showConfirm({
      title: 'Kembalikan Alat?',
      text: `Apakah Anda yakin ingin menandai "${item.alat_bahan?.nama_alat}" sebagai dikembalikan?`,
      confirmText: 'Ya, Kembalikan',
      icon: 'question'
    });

    if (result.isConfirmed) {
      try {
        setReturnLoading(true);
        await transaksiService.returnItem(item.id_transaksi);
        await loadTransaksis();
        showSuccessToast(`"${item.alat_bahan?.nama_alat}" berhasil dikembalikan`);
      } catch (error) {
        console.error('Error returning item:', error);
        const errorMessage = error.response?.data?.message || 'Gagal mengembalikan alat';
        showErrorToast(errorMessage);
      } finally {
        setReturnLoading(false);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      showLoading(selectedItem ? 'Mengupdate transaksi...' : 'Membuat transaksi...');

      if (selectedItem) {
        await transaksiService.update(selectedItem.id_transaksi, formData);
        showSuccessToast('Transaksi berhasil diupdate');
      } else {
        await transaksiService.create(formData);
        showSuccessToast('Transaksi berhasil dibuat');
      }

      await loadTransaksis();
      setFormOpen(false);
      setSelectedItem(null);
      closeAlert();
    } catch (error) {
      closeAlert();
      console.error('Error saving transaksi:', error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan transaksi';

      // Show specific error messages for business logic
      if (error.response?.data?.message?.includes('tidak dapat diubah')) {
        showErrorToast('Transaksi tidak dapat diubah karena sudah digunakan');
      } else if (error.response?.data?.message?.includes('jenis item')) {
        showErrorToast('Tidak dapat mengubah jenis item dalam transaksi');
      } else if (error.response?.data?.message?.includes('Stok tidak mencukupi')) {
        showErrorToast(error.response.data.message);
      } else if (error.response?.data?.message?.includes('tanggal kembali')) {
        showErrorToast('Tanggal kembali wajib untuk alat');
      } else {
        showErrorToast(errorMessage);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Filter transactions based on active tab
  const filteredTransaksis = transaksis.filter(transaksi => {
    switch (activeTab) {
      case 'active':
        return transaksi.status === 'pinjam';
      case 'returned':
        return transaksi.status === 'kembali';
      case 'consumed':
        return transaksi.status === 'habis';
      default:
        return true;
    }
  });

  // Calculate statistics
  const stats = {
    total: transaksis.length,
    active: transaksis.filter(t => t.status === 'pinjam').length,
    returned: transaksis.filter(t => t.status === 'kembali').length,
    consumed: transaksis.filter(t => t.status === 'habis').length,
    alat: transaksis.filter(t => t.alat_bahan?.jenis === 'alat').length,
    bahan: transaksis.filter(t => t.alat_bahan?.jenis === 'bahan').length,
    alatActive: transaksis.filter(t => t.alat_bahan?.jenis === 'alat' && t.status === 'pinjam').length,
    bahanConsumed: transaksis.filter(t => t.alat_bahan?.jenis === 'bahan' && t.status === 'habis').length
  };

  // Get tab counts for badges
  const tabCounts = {
    all: transaksis.length,
    active: stats.active,
    returned: stats.returned,
    consumed: stats.consumed
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Transaksi</h1>
          <p className="text-gray-600 mt-1">Management peminjaman dan pengembalian alat & bahan</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <IconPlus className="h-5 w-5" />
            Buat Transaksi
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <IconClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <IconClock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Aktif</p>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <IconCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dikembali</p>
              <p className="text-2xl font-bold text-gray-800">{stats.returned}</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <IconPackage className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Digunakan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.consumed}</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <IconPackage className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Alat Aktif</p>
              <p className="text-2xl font-bold text-gray-800">{stats.alatActive}</p>
            </div>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <IconPackage className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Bahan Digunakan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.bahanConsumed}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glassmorphism p-1 rounded-lg inline-flex">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-md transition relative ${activeTab === 'all'
              ? 'bg-primary-500 text-gray-600'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          Semua
          {tabCounts.all > 0 && (
            <span className={`absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'all' ? 'bg-gray-500 text-white' : 'bg-white text-gray-600'
              }`}>
              {tabCounts.all}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-md transition relative ${activeTab === 'active'
              ? 'bg-yellow-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          Sedang Dipinjam
          {tabCounts.active > 0 && (
            <span className={`absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'active' ? 'bg-white text-yellow-500' : 'bg-yellow-500 text-white'
              }`}>
              {tabCounts.active}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('returned')}
          className={`px-4 py-2 rounded-md transition relative ${activeTab === 'returned'
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          Dikembalikan
          {tabCounts.returned > 0 && (
            <span className={`absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'returned' ? 'bg-white text-green-500' : 'bg-green-500 text-white'
              }`}>
              {tabCounts.returned}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('consumed')}
          className={`px-4 py-2 rounded-md transition relative ${activeTab === 'consumed'
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
        >
          Digunakan
          {tabCounts.consumed > 0 && (
            <span className={`absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 ${activeTab === 'consumed' ? 'bg-white text-blue-500' : 'bg-blue-500 text-white'
              }`}>
              {tabCounts.consumed}
            </span>
          )}
        </button>
      </div>

      {/* Table Info */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {activeTab === 'all' && 'Semua Transaksi'}
            {activeTab === 'active' && 'Transaksi Aktif'}
            {activeTab === 'returned' && 'Transaksi Dikembalikan'}
            {activeTab === 'consumed' && 'Transaksi Digunakan'}
          </h3>
          <p className="text-sm text-gray-600">
            Menampilkan {filteredTransaksis.length} dari {transaksis.length} transaksi
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="glassmorphism p-6 rounded-xl shadow-md">
        <TransaksiTable
          data={filteredTransaksis}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReturn={handleReturn}
          isLoading={loading}
        />
      </div>
      {/* Business Logic Info */}
      {/* <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">📋 Sistem Peminjaman INVENTA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-primary-700 mb-3 flex items-center">
              <IconPackage className="h-5 w-5 mr-2" />
              Untuk Alat (Tools):
            </h4>
            <ul className="text-primary-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Harus dikembalikan dengan status <strong>"Kembali"</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Wajib mengisi <strong>tanggal kembali</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Stok <strong>tidak berkurang</strong> saat dipinjam</span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Dapat digunakan <strong>berulang kali</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-primary-100 text-primary-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Bisa <strong>diedit & dikembalikan</strong></span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center">
              <IconPackage className="h-5 w-5 mr-2" />
              Untuk Bahan (Materials):
            </h4>
            <ul className="text-green-600 space-y-2">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Bersifat <strong>consumable (habis pakai)</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Status otomatis <strong>"Habis"</strong></span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span>Stok <strong>langsung berkurang</strong> saat transaksi</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✓</span>
                <span><strong>Tidak perlu</strong> dikembalikan</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">✗</span>
                <span><strong>Tidak bisa diubah</strong> setelah digunakan</span>
              </li>
            </ul>
          </div>
        </div>
      </div> */}

      {/* Form Modal */}
      <TransaksiForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        isLoading={formLoading}
      />
    </div>
  );
};

export default Transaksi;
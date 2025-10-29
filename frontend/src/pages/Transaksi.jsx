/* eslint-disable no-unused-vars */
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
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [returnLoading, setReturnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        showErrorToast('Gagal menghapus transaksi');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleReturn = async (item) => {
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
        showErrorToast('Gagal mengembalikan alat');
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
      showErrorToast('Terjadi kesalahan saat menyimpan transaksi');
    } finally {
      setFormLoading(false);
    }
  };

  // 🔍 FILTER + TAB
  const filteredTransaksis = transaksis.filter(transaksi => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && transaksi.status === 'pinjam') ||
      (activeTab === 'returned' && transaksi.status === 'kembali') ||
      (activeTab === 'consumed' && transaksi.status === 'habis');

    const matchesSearch = transaksi.alat_bahan?.nama_alat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaksi.peminjam?.nama_peminjam?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaksi.status?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredTransaksis.length / itemsPerPage);
  const currentData = filteredTransaksis.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: transaksis.length,
    active: transaksis.filter(t => t.status === 'pinjam').length,
    returned: transaksis.filter(t => t.status === 'kembali').length,
    consumed: transaksis.filter(t => t.status === 'habis').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Transaksi</h1>
          <p className="text-gray-600 mt-1">Management peminjaman & pengembalian alat/bahan</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <IconPlus className="h-5 w-5" />
          Buat Transaksi
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Semua ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1 rounded-md ${activeTab === 'active' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Aktif ({stats.active})
          </button>
          <button
            onClick={() => setActiveTab('returned')}
            className={`px-3 py-1 rounded-md ${activeTab === 'returned' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Kembali ({stats.returned})
          </button>
          <button
            onClick={() => setActiveTab('consumed')}
            className={`px-3 py-1 rounded-md ${activeTab === 'consumed' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Habis ({stats.consumed})
          </button>
        </div>

        <input
          type="text"
          placeholder="Cari transaksi..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="glassmorphism p-6 rounded-xl shadow-md">
        <TransaksiTable
          data={currentData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReturn={handleReturn}
          isLoading={loading}
        />

        {/* Pagination */}
        {filteredTransaksis.length > itemsPerPage && (
          <div className="flex justify-center mt-4 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              ← Sebelumnya
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              Selanjutnya →
            </button>
          </div>
        )}
      </div>

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

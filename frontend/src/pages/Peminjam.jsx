/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { peminjamService } from '../services/api';
import PeminjamTable from '../components/tables/PeminjamTable';
import PeminjamForm from '../components/forms/PeminjamForm';
import { 
  IconPlus, 
  IconUsers, 
  IconClipboardList,
  IconUserCheck,
  IconSearch
} from '@tabler/icons-react';
import { 
  showSuccessToast, 
  showErrorToast, 
  showDeleteConfirm,
  showLoading,
  closeAlert 
} from '../services/sweetAlert';

const Peminjam = () => {
  const navigate = useNavigate();
  const [peminjam, setPeminjam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 🧩 Search & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadPeminjam();
  }, []);

  const loadPeminjam = async () => {
    try {
      setLoading(true);
      const response = await peminjamService.getWithStats();
      setPeminjam(response.data);
    } catch (error) {
      console.error('Error loading peminjam:', error);
      showErrorToast('Gagal memuat data peminjam');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    const result = await showDeleteConfirm(item.Nama_peminjam);
    
    if (result.isConfirmed) {
      try {
        setDeleteLoading(true);
        await peminjamService.delete(item.id_peminjam);
        await loadPeminjam();
        showSuccessToast(`${item.Nama_peminjam} berhasil dihapus`);
      } catch (error) {
        console.error('Error deleting peminjam:', error);
        const errorMessage = error.response?.data?.message || 'Gagal menghapus data peminjam';
        showErrorToast(errorMessage);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      showLoading(selectedItem ? 'Mengupdate data...' : 'Menyimpan data...');
      
      if (selectedItem) {
        await peminjamService.update(selectedItem.id_peminjam, formData);
        showSuccessToast(`${formData.Nama_peminjam} berhasil diupdate`);
      } else {
        await peminjamService.create(formData);
        showSuccessToast(`${formData.Nama_peminjam} berhasil ditambahkan`);
      }
      
      await loadPeminjam();
      setFormOpen(false);
      setSelectedItem(null);
      closeAlert();
    } catch (error) {
      closeAlert();
      console.error('Error saving peminjam:', error);
      const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data';
      showErrorToast(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // 📊 Stats
  const stats = {
    total: peminjam.length,
    aktif: peminjam.filter(p => p.peminjaman_aktif > 0).length,
    totalPeminjaman: peminjam.reduce((sum, p) => sum + (p.total_peminjaman || 0), 0),
    rataRata: peminjam.length > 0 
      ? (peminjam.reduce((sum, p) => sum + (p.total_peminjaman || 0), 0) / peminjam.length).toFixed(1)
      : 0
  };

  // 🔍 Filter data berdasarkan pencarian
  const filteredData = peminjam.filter(p =>
    p.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.kelas && p.kelas.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.jurusan && p.jurusan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 📄 Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Data Peminjam</h1>
          <p className="text-gray-600 mt-1">Management data peminjam alat dan bahan prakarya</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <IconPlus className="h-5 w-5" />
          Tambah Peminjam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: IconUsers, label: 'Total Peminjam', value: stats.total, color: 'blue' },
          { icon: IconUserCheck, label: 'Sedang Meminjam', value: stats.aktif, color: 'green' },
          { icon: IconClipboardList, label: 'Total Peminjaman', value: stats.totalPeminjaman, color: 'purple' },
          { icon: IconUsers, label: 'Rata-rata', value: stats.rataRata, color: 'orange', extra: 'per peminjam' }
        ].map((card, i) => (
          <div key={i} className="glassmorphism p-4 rounded-xl shadow-md">
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-${card.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                <card.icon className={`w-5 h-5 text-${card.color}-600`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                {card.extra && <p className="text-xs text-gray-500">{card.extra}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <div className="relative w-full md:w-1/3">
          <IconSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama, kelas, atau jurusan..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page
            }}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glassmorphism p-6 rounded-xl shadow-md">
        <PeminjamTable
          data={currentData}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
        />

        {/* Pagination Controls */}
        {filteredData.length > itemsPerPage && (
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {filteredData.length === 0 && !loading && (
          <p className="text-center text-gray-500 mt-4">
            Tidak ada data yang cocok dengan pencarian.
          </p>
        )}
      </div>

      {/* Form */}
      <PeminjamForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedItem}
        isLoading={formLoading}
      />
    </div>
  );
};

export default Peminjam;

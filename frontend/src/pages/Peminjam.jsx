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
  IconUserX
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

  const stats = {
    total: peminjam.length,
    aktif: peminjam.filter(p => p.peminjaman_aktif > 0).length,
    totalPeminjaman: peminjam.reduce((sum, p) => sum + (p.total_peminjaman || 0), 0),
    rataRata: peminjam.length > 0 ? (peminjam.reduce((sum, p) => sum + (p.total_peminjaman || 0), 0) / peminjam.length).toFixed(1) : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <IconUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Peminjam</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <IconUserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sedang Meminjam</p>
              <p className="text-2xl font-bold text-gray-800">{stats.aktif}</p>
            </div>
          </div>
        </div>
        
        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <IconClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Peminjaman</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalPeminjaman}</p>
            </div>
          </div>
        </div>
        
        <div className="glassmorphism p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <IconUsers className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rata-rata</p>
              <p className="text-2xl font-bold text-gray-800">{stats.rataRata}</p>
              <p className="text-xs text-gray-500">per peminjam</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glassmorphism p-6 rounded-xl shadow-md">
        <PeminjamTable
          data={peminjam}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </div>

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
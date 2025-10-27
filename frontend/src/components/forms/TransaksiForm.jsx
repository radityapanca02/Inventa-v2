import { useState, useEffect } from 'react';
import Modal from '../ui/modal';
import { alatBahanService } from '../../services/api';
import { peminjamService } from '../../services/api';

const TransaksiForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    id_peminjam: '',
    id_alat: '',
    jumlah_pinjam: '',
    tgl_pinjam: '',
    tgl_kembali: '',
    status: 'pinjam'
  });
  const [errors, setErrors] = useState({});
  const [alatBahanList, setAlatBahanList] = useState([]);
  const [peminjamList, setPeminjamList] = useState([]);
  const [selectedAlat, setSelectedAlat] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.id_alat) {
      const alat = alatBahanList.find(item => item.id_alat == formData.id_alat);
      setSelectedAlat(alat);
      
      // Auto-set status based on item type
      if (alat) {
        const newStatus = alat.jenis === 'alat' ? 'pinjam' : 'habis';
        setFormData(prev => ({
          ...prev,
          status: newStatus,
          tgl_kembali: alat.jenis === 'bahan' ? '' : prev.tgl_kembali
        }));
      }
    }
  }, [formData.id_alat, alatBahanList]);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        id_peminjam: initialData.id_peminjam || '',
        id_alat: initialData.id_alat || '',
        jumlah_pinjam: initialData.jumlah_pinjam || '',
        tgl_pinjam: initialData.tgl_pinjam ? initialData.tgl_pinjam.split('T')[0] : '',
        tgl_kembali: initialData.tgl_kembali ? initialData.tgl_kembali.split('T')[0] : '',
        status: initialData.status || 'pinjam'
      });
    } else {
      setFormData({
        id_peminjam: '',
        id_alat: '',
        jumlah_pinjam: '',
        tgl_pinjam: new Date().toISOString().split('T')[0],
        tgl_kembali: '',
        status: 'pinjam'
      });
    }
    setErrors({});
    setSelectedAlat(null);
  }, [initialData, isOpen]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [alatResponse, peminjamResponse] = await Promise.all([
        alatBahanService.getAll(),
        peminjamService.getAll()
      ]);
      setAlatBahanList(alatResponse.data);
      setPeminjamList(peminjamResponse.data);
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.id_peminjam) newErrors.id_peminjam = 'Pilih peminjam';
    if (!formData.id_alat) newErrors.id_alat = 'Pilih alat/bahan';
    if (!formData.jumlah_pinjam || formData.jumlah_pinjam < 1) newErrors.jumlah_pinjam = 'Jumlah harus lebih dari 0';
    if (!formData.tgl_pinjam) newErrors.tgl_pinjam = 'Tanggal pinjam harus diisi';
    
    // Validation for tools
    if (selectedAlat?.jenis === 'alat') {
      if (!formData.tgl_kembali) newErrors.tgl_kembali = 'Tanggal kembali wajib untuk alat';
      if (formData.tgl_kembali && formData.tgl_pinjam && formData.tgl_kembali < formData.tgl_pinjam) {
        newErrors.tgl_kembali = 'Tanggal kembali harus setelah tanggal pinjam';
      }
    }

    // Check stock
    if (selectedAlat && formData.jumlah_pinjam > selectedAlat.jumlah) {
      newErrors.jumlah_pinjam = `Stok tidak mencukupi. Stok tersedia: ${selectedAlat.jumlah}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const getAvailableStock = () => {
    if (!selectedAlat) return 0;
    return selectedAlat.jumlah;
  };

  const isAlat = selectedAlat?.jenis === 'alat';
  const isBahan = selectedAlat?.jenis === 'bahan';

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Transaksi' : 'Buat Transaksi Baru'}
      className="max-w-2xl"
    >
      {loadingData ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Peminjam Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peminjam *
              </label>
              <select
                name="id_peminjam"
                value={formData.id_peminjam}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.id_peminjam ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Peminjam</option>
                {peminjamList.map(peminjam => (
                  <option key={peminjam.id_peminjam} value={peminjam.id_peminjam}>
                    {peminjam.nama_peminjam} - {peminjam.kontak}
                  </option>
                ))}
              </select>
              {errors.id_peminjam && (
                <p className="text-red-500 text-xs mt-1">{errors.id_peminjam}</p>
              )}
            </div>

            {/* Alat/Bahan Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alat/Bahan *
              </label>
              <select
                name="id_alat"
                value={formData.id_alat}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.id_alat ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Alat/Bahan</option>
                {alatBahanList.map(item => (
                  <option key={item.id_alat} value={item.id_alat}>
                    {item.nama_alat} ({item.jenis}) - Stok: {item.jumlah}
                  </option>
                ))}
              </select>
              {errors.id_alat && (
                <p className="text-red-500 text-xs mt-1">{errors.id_alat}</p>
              )}
            </div>
          </div>

          {/* Item Information */}
          {selectedAlat && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Informasi Item</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-600">Jenis:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAlat.jenis === 'alat' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedAlat.jenis}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">Kondisi:</span> 
                  <span className="ml-2 font-medium">{selectedAlat.kondisi}</span>
                </div>
                <div>
                  <span className="text-blue-600">Stok Tersedia:</span> 
                  <span className="ml-2 font-medium">{selectedAlat.jumlah}</span>
                </div>
                <div>
                  <span className="text-blue-600">Status:</span> 
                  <span className="ml-2 font-medium">
                    {isAlat ? 'Harus dikembalikan' : 'Consumable (tidak dikembalikan)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Jumlah Pinjam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah Pinjam *
              </label>
              <input
                type="number"
                name="jumlah_pinjam"
                value={formData.jumlah_pinjam}
                onChange={handleChange}
                min="1"
                max={getAvailableStock()}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.jumlah_pinjam ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Jumlah"
              />
              {errors.jumlah_pinjam && (
                <p className="text-red-500 text-xs mt-1">{errors.jumlah_pinjam}</p>
              )}
              {selectedAlat && (
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal: {getAvailableStock()} {selectedAlat.jenis}
                </p>
              )}
            </div>

            {/* Tanggal Pinjam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Pinjam *
              </label>
              <input
                type="date"
                name="tgl_pinjam"
                value={formData.tgl_pinjam}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.tgl_pinjam ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.tgl_pinjam && (
                <p className="text-red-500 text-xs mt-1">{errors.tgl_pinjam}</p>
              )}
            </div>

            {/* Tanggal Kembali (Conditional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Kembali {isAlat && '*'}
              </label>
              <input
                type="date"
                name="tgl_kembali"
                value={formData.tgl_kembali}
                onChange={handleChange}
                disabled={isBahan}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.tgl_kembali ? 'border-red-500' : 'border-gray-300'
                } ${isBahan ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {errors.tgl_kembali && (
                <p className="text-red-500 text-xs mt-1">{errors.tgl_kembali}</p>
              )}
              {isBahan && (
                <p className="text-xs text-gray-500 mt-1">Bahan tidak dikembalikan</p>
              )}
            </div>
          </div>

          {/* Status (for edit only) */}
          {initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="pinjam">Pinjam</option>
                <option value="kembali">Kembali</option>
                <option value="habis">Habis</option>
              </select>
            </div>
          )}

          {/* Business Logic Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Ketentuan Peminjaman:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Alat</strong> harus dikembalikan dengan status "Kembali"</li>
              <li>• <strong>Bahan</strong> bersifat consumable dan status otomatis "Habis"</li>
              <li>• Stok bahan akan langsung berkurang saat transaksi dibuat</li>
              <li>• Alat yang dikembalikan akan tersedia untuk dipinjam lagi</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : (initialData ? 'Update Transaksi' : 'Buat Transaksi')}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TransaksiForm;
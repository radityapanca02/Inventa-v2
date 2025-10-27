import { useState, useEffect } from 'react';
import Modal from '../ui/modal';

const PeminjamForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    nama_peminjam: '',
    kontak: '',
    alasan: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        nama_peminjam: initialData.nama_peminjam || '',
        kontak: initialData.kontak || '',
        alasan: initialData.alasan || ''
      });
    } else {
      setFormData({
        nama_peminjam: '',
        kontak: '',
        alasan: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

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
    if (!formData.nama_peminjam.trim()) newErrors.nama_peminjam = 'Nama peminjam harus diisi';
    if (!formData.kontak.trim()) newErrors.kontak = 'Kontak harus diisi';
    if (!formData.alasan.trim()) newErrors.alasan = 'Alasan peminjaman harus diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Data Peminjam' : 'Tambah Data Peminjam'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Peminjam *
          </label>
          <input
            type="text"
            name="nama_peminjam"
            value={formData.nama_peminjam}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.nama_peminjam ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.nama_peminjam && (
            <p className="text-red-500 text-xs mt-1">{errors.nama_peminjam}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kontak *
          </label>
          <input
            type="text"
            name="kontak"
            value={formData.kontak}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.kontak ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Nomor HP atau WhatsApp"
          />
          {errors.kontak && (
            <p className="text-red-500 text-xs mt-1">{errors.kontak}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alasan Peminjaman *
          </label>
          <textarea
            name="alasan"
            value={formData.alasan}
            onChange={handleChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.alasan ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jelaskan tujuan peminjaman alat/bahan"
          />
          {errors.alasan && (
            <p className="text-red-500 text-xs mt-1">{errors.alasan}</p>
          )}
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
            {isLoading ? 'Menyimpan...' : (initialData ? 'Update' : 'Simpan')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PeminjamForm;
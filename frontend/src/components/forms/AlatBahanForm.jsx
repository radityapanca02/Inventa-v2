import { useState, useEffect } from 'react';
import Modal from '../ui/modal';

const AlatBahanForm = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    nama_alat: '',
    jenis: 'alat',
    kondisi: 'baik',
    jumlah: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nama_alat: initialData.nama_alat || '',
        jenis: initialData.jenis || 'alat',
        kondisi: initialData.kondisi || 'baik',
        jumlah: initialData.jumlah || ''
      });
    } else {
      setFormData({
        nama_alat: '',
        jenis: 'alat',
        kondisi: 'baik',
        jumlah: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlah' ? parseInt(value) || '' : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.nama_alat.trim()) newErrors.nama_alat = 'Nama alat/bahan harus diisi';
    if (!formData.jumlah && formData.jumlah !== 0) newErrors.jumlah = 'Jumlah harus diisi';
    if (formData.jumlah < 0) newErrors.jumlah = 'Jumlah tidak boleh negatif';

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
      title={initialData ? 'Edit Alat/Bahan' : 'Tambah Alat/Bahan'}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Alat/Bahan *
          </label>
          <input
            type="text"
            name="nama_alat"
            value={formData.nama_alat}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.nama_alat ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama alat/bahan"
          />
          {errors.nama_alat && (
            <p className="text-red-500 text-xs mt-1">{errors.nama_alat}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis *
          </label>
          <select
            name="jenis"
            value={formData.jenis}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="alat">Alat</option>
            <option value="bahan">Bahan</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kondisi *
          </label>
          <select
            name="kondisi"
            value={formData.kondisi}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="baik">Baik</option>
            <option value="rusak">Rusak</option>
            <option value="hilang">Hilang</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah *
          </label>
          <input
            type="number"
            name="jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.jumlah ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan jumlah"
          />
          {errors.jumlah && (
            <p className="text-red-500 text-xs mt-1">{errors.jumlah}</p>
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

export default AlatBahanForm;
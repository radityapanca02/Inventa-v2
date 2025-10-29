/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { alatBahanService } from '../services/api';
import AlatBahanTable from '../components/tables/AlatBahanTable';
import AlatBahanForm from '../components/forms/AlatBahanForm';
import { IconPlus, IconPackage, IconSearch } from '@tabler/icons-react';
import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirm,
    showLoading,
    closeAlert
} from '../services/sweetAlert';

const AlatBahan = () => {
    const [alatBahan, setAlatBahan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // ⚙️ Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        loadAlatBahan();
    }, []);

    const loadAlatBahan = async () => {
        try {
            setLoading(true);
            const response = await alatBahanService.getAll();
            setAlatBahan(response.data);
        } catch (error) {
            console.error('Error loading alat/bahan:', error);
            showErrorToast('Gagal memuat data alat/bahan');
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
        const result = await showDeleteConfirm(item.nama_alat);
        if (result.isConfirmed) {
            try {
                setDeleteLoading(true);
                await alatBahanService.delete(item.id_alat);
                await loadAlatBahan();
                showSuccessToast(`${item.nama_alat} berhasil dihapus`);
            } catch (error) {
                console.error('Error deleting alat/bahan:', error);
                showErrorToast('Gagal menghapus data');
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
                await alatBahanService.update(selectedItem.id_alat, formData);
                showSuccessToast(`${formData.nama_alat} berhasil diupdate`);
            } else {
                await alatBahanService.create(formData);
                showSuccessToast(`${formData.nama_alat} berhasil ditambahkan`);
            }

            await loadAlatBahan();
            setFormOpen(false);
            setSelectedItem(null);
            closeAlert();
        } catch (error) {
            closeAlert();
            console.error('Error saving alat/bahan:', error);
            const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data';
            showErrorToast(errorMessage);
        } finally {
            setFormLoading(false);
        }
    };

    const stats = {
        total: alatBahan.length,
        alat: alatBahan.filter(item => item.jenis === 'alat').length,
        bahan: alatBahan.filter(item => item.jenis === 'bahan').length,
        totalJumlah: alatBahan.reduce((sum, item) => sum + item.jumlah, 0)
    };

    // 🔍 Filter data sesuai pencarian
    const filteredData = alatBahan.filter(item =>
        item.nama_alat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenis.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Alat & Bahan</h1>
                    <p className="text-gray-600 mt-1">Management alat dan bahan prakarya ekstrakurikuler</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <IconPlus className="h-5 w-5" />
                    Tambah Alat/Bahan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Items', value: stats.total, color: 'blue' },
                    { label: 'Total Alat', value: stats.alat, color: 'green' },
                    { label: 'Total Bahan', value: stats.bahan, color: 'purple' },
                    { label: 'Total Stok', value: stats.totalJumlah, color: 'orange' }
                ].map((card, i) => (
                    <div key={i} className="glassmorphism p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className={`w-10 h-10 bg-${card.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                                <IconPackage className={`w-5 h-5 text-${card.color}-600`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="flex justify-between items-center">
                <div className="relative w-full md:w-1/3">
                    <IconSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama atau jenis..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // reset ke halaman pertama saat search berubah
                        }}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glassmorphism p-6 rounded-xl shadow-md">
                <AlatBahanTable
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
                                className={`px-3 py-1 rounded ${currentPage === i + 1
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
                    <p className="text-center text-gray-500 mt-4">Tidak ada data yang cocok dengan pencarian.</p>
                )}
            </div>

            {/* Form */}
            <AlatBahanForm
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedItem}
                isLoading={formLoading}
            />
        </div>
    );
};

export default AlatBahan;

import { useState, useEffect } from 'react';
import { alatBahanService } from '../services/api';
import AlatBahanTable from '../components/tables/AlatBahanTable';
import AlatBahanForm from '../components/forms/AlatBahanForm';
import { IconPlus, IconPackage } from '@tabler/icons-react';
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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Kelola Alat & Bahan</h1>
                    <p className="text-gray-600 mt-1">Management alat dan bahan prakarya ekstrakurikuler</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                    <IconPlus className="h-5 w-5" />
                    Tambah Alat/Bahan
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glassmorphism p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <IconPackage className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="glassmorphism p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <IconPackage className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Alat</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.alat}</p>
                        </div>
                    </div>
                </div>

                <div className="glassmorphism p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <IconPackage className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Bahan</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.bahan}</p>
                        </div>
                    </div>
                </div>

                <div className="glassmorphism p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <IconPackage className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Stok</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.totalJumlah}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glassmorphism p-6 rounded-xl shadow-md">
                <AlatBahanTable
                    data={alatBahan}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isLoading={loading}
                />
            </div>

            <AlatBahanForm
                isOpen={formOpen} x
                onClose={() => setFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedItem}
                isLoading={formLoading}
            />
        </div>
    );
};

export default AlatBahan;
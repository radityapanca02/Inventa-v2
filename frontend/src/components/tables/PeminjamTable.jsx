import { IconEdit, IconTrash, IconUsers, IconClipboardList } from '@tabler/icons-react';

const PeminjamTable = ({ data, onEdit, onDelete, isLoading }) => {
    const getStatusBadge = (peminjamanAktif, totalPeminjaman) => {
        if (peminjamanAktif > 0) {
            return (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                    Sedang Meminjam
                </span>
            );
        } else if (totalPeminjaman > 0) {
            return (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Aktif
                </span>
            );
        } else {
            return (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    Baru
                </span>
            );
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <IconUsers className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data peminjam</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan data peminjam pertama.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nama Peminjam
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kontak
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alasan
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statistik
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((peminjam) => (
                        <tr key={peminjam.id_peminjam} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{peminjam.nama_peminjam}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{peminjam.kontak}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">{peminjam.alasan}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <IconClipboardList className="h-4 w-4 mr-1" />
                                        {peminjam.total_peminjaman || 0} total
                                    </div>
                                    {peminjam.peminjaman_aktif > 0 && (
                                        <div className="flex items-center text-yellow-600">
                                            <IconClipboardList className="h-4 w-4 mr-1" />
                                            {peminjam.peminjaman_aktif} aktif
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(peminjam.peminjaman_aktif, peminjam.total_peminjaman)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(peminjam)}
                                        className="text-primary-600 hover:text-primary-900 transition"
                                        title="Edit"
                                    >
                                        <IconEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(peminjam)}
                                        className="text-red-600 hover:text-red-900 transition"
                                        title="Hapus"
                                    >
                                        <IconTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PeminjamTable;
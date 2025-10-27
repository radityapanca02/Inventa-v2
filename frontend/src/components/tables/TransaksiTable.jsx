import { IconEdit, IconTrash, IconClipboardList, IconCheck, IconPackage } from '@tabler/icons-react';

const TransaksiTable = ({ data, onEdit, onDelete, onReturn, isLoading }) => {
  const getStatusBadge = (status, jenis) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    const statusConfig = {
      pinjam: { class: "bg-yellow-100 text-yellow-800", text: "Dipinjam" },
      kembali: { class: "bg-green-100 text-green-800", text: "Dikembalikan" },
      habis: { class: "bg-blue-100 text-blue-800", text: "Digunakan" }
    };

    const config = statusConfig[status] || statusConfig.pinjam;
    
    return (
      <span className={`${baseClasses} ${config.class}`}>
        {config.text}
      </span>
    );
  };

  const getJenisBadge = (jenis) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        jenis === 'alat' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
      }`}>
        {jenis}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
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
        <IconClipboardList className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data transaksi</h3>
        <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat transaksi peminjaman pertama.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Peminjam
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
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
          {data.map((transaksi) => (
            <tr key={transaksi.id_transaksi} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{transaksi.peminjam?.Nama_peminjam}</div>
                <div className="text-sm text-gray-500">{transaksi.peminjam?.kontak}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{transaksi.alat_bahan?.nama_alat}</div>
                <div className="text-sm text-gray-500">{transaksi.alat_bahan?.kondisi}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getJenisBadge(transaksi.alat_bahan?.jenis)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{transaksi.jumlah_pinjam}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  <div>Pinjam: {formatDate(transaksi.tgl_pinjam)}</div>
                  {transaksi.tgl_kembali && (
                    <div>Kembali: {formatDate(transaksi.tgl_kembali)}</div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(transaksi.status, transaksi.alat_bahan?.jenis)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(transaksi)}
                    className="text-primary-600 hover:text-primary-900 transition"
                    title="Edit"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                  
                  {transaksi.status === 'pinjam' && transaksi.alat_bahan?.jenis === 'alat' && (
                    <button
                      onClick={() => onReturn(transaksi)}
                      className="text-green-600 hover:text-green-900 transition"
                      title="Kembalikan"
                    >
                      <IconCheck className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(transaksi)}
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

export default TransaksiTable;
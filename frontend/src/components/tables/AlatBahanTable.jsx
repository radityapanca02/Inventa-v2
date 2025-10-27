import { IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';

const AlatBahanTable = ({ data, onEdit, onDelete, isLoading }) => {
  const getJenisBadge = (jenis) => {
    const styles = {
      alat: 'bg-blue-100 text-blue-800',
      bahan: 'bg-green-100 text-green-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[jenis]}`}>
        {jenis === 'alat' ? 'Alat' : 'Bahan'}
      </span>
    );
  };

  const getKondisiBadge = (kondisi) => {
    const styles = {
      baik: 'bg-green-100 text-green-800',
      rusak: 'bg-red-100 text-red-800',
      hilang: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[kondisi]}`}>
        {kondisi}
      </span>
    );
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
        <IconPackage className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
        <p className="mt-1 text-sm text-gray-500">Mulai dengan menambahkan alat atau bahan pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Alat/Bahan
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jenis
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kondisi
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jumlah
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id_alat} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.nama_alat}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getJenisBadge(item.jenis)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getKondisiBadge(item.kondisi)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.jumlah}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-primary-600 hover:text-primary-900 transition"
                  >
                    <IconEdit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-red-600 hover:text-red-900 transition"
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

export default AlatBahanTable;
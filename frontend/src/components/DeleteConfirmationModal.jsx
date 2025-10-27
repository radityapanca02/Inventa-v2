import Modal from './ui/modal';
import { IconAlertTriangle } from '@tabler/icons-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, item, isLoading }) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
      <div className="text-center">
        <IconAlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Hapus {item.nama_alat}?
        </h3>

        <p className="text-sm text-gray-500 mb-6">
          Apakah Anda yakin ingin menghapus {item.jenis} ini? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(item.id_alat)}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
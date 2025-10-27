import Modal from './ui/modal';
import { IconLogout, IconAlertTriangle } from '@tabler/icons-react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Logout">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
          <IconLogout className="h-6 w-6 text-yellow-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Keluar dari INVENTA?
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          Anda akan keluar dari sistem manajemen peminjaman. Pastikan semua pekerjaan sudah disimpan.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 cursor-pointer bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Logout...</span>
              </>
            ) : (
              <>
                <IconLogout className="h-4 w-4" />
                <span>Ya, Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmationModal;
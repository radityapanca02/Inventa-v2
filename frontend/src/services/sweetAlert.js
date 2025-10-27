import Swal from 'sweetalert2';

// SweetAlert configuration
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const showSuccess = (message, title = 'Berhasil!') => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    timer: 2000,
    showConfirmButton: false,
  });
};

export const showSuccessToast = (message) => {
  Toast.fire({
    icon: 'success',
    title: message,
  });
};

export const showError = (message, title = 'Terjadi Kesalahan!') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#ef4444',
  });
};

export const showErrorToast = (message) => {
  Toast.fire({
    icon: 'error',
    title: message,
  });
};

export const showWarning = (message, title = 'Peringatan!') => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#f59e0b',
  });
};

export const showInfo = (message, title = 'Informasi') => {
  Swal.fire({
    icon: 'info',
    title: title,
    text: message,
    confirmButtonColor: '#3b82f6',
  });
};

export const showConfirm = (options) => {
  return Swal.fire({
    icon: 'question',
    title: options.title || 'Apakah Anda yakin?',
    text: options.text,
    showCancelButton: true,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    confirmButtonText: options.confirmText || 'Ya, lanjutkan',
    cancelButtonText: options.cancelText || 'Batal',
    reverseButtons: true,
    ...options,
  });
};

// Delete confirmation
export const showDeleteConfirm = (itemName) => {
  return showConfirm({
    title: 'Hapus Data?',
    text: `Apakah Anda yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`,
    icon: 'warning',
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'Ya, Hapus!',
    showCancelButton: true,
    cancelButtonText: 'Batal',
  });
};

export const showLoading = (title = 'Memproses...') => {
  Swal.fire({
    title: title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeAlert = () => {
  Swal.close();
};

export default Swal;
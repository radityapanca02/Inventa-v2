/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { showSuccessToast, showErrorToast } from '../services/sweetAlert';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await authService.getUser();
        setUser(userData.user);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        showErrorToast('Sesi telah berakhir, silakan login kembali');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
      showSuccessToast('Logout berhasil');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUser(response.user);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      showSuccessToast('Profile berhasil diperbarui');
      return response;
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Gagal memperbarui profile');
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
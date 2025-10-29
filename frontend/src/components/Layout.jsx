import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FloatingDock } from './ui/floating-dock';
import EditProfileModal from './EditProfilModal';
import LogoutConfirmationModal from './LogoutConfirmationModal';
import { useState } from 'react';
import image from '../assets/icon.png';
import {
  IconHome,
  IconPackage,
  IconUsers,
  IconClipboardList,
  IconUser,
  IconSettings,
  IconLogout
} from '@tabler/icons-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const getActiveSection = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'dashboard';
    if (path === '/alat-bahan') return 'alat-bahan';
    if (path === '/peminjam') return 'peminjam';
    if (path === '/transaksi') return 'transaksi';
    return 'dashboard';
  };

  const navigationItems = [
    {
      title: 'Dashboard',
      icon: <IconHome className="h-full w-full" />,
      href: '/dashboard',
    },
    {
      title: 'Alat & Bahan',
      icon: <IconPackage className="h-full w-full" />,
      href: '/alat-bahan',
    },
    {
      title: 'Peminjam',
      icon: <IconUsers className="h-full w-full" />,
      href: '/peminjam',
    },
    {
      title: 'Transaksi',
      icon: <IconClipboardList className="h-full w-full" />,
      href: '/transaksi',
    },
    {
      title: 'Profile',
      icon: <IconUser className="h-full w-full" />,
      href: '#profile',
    }
  ];

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setLogoutLoading(true);
      await logout();
      setIsLogoutModalOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleNavigation = (href, event) => {
    event.preventDefault();
    
    if (href === '#profile') {
      setIsProfileModalOpen(true);
      return;
    }
    
    if (href === '#logout') {
      handleLogoutClick();
      return;
    }
    
    navigate(href);
  };

  const customNavigationItems = navigationItems.map(item => ({
    ...item,
    onClick: (e) => handleNavigation(item.href, e),
    isActive: getActiveSection() === item.href.replace('/', '')
  }));

  const getPageTitle = () => {
    const section = getActiveSection();
    switch (section) {
      case 'dashboard': return 'Dashboard';
      case 'alat-bahan': return 'Alat & Bahan';
      case 'peminjam': return 'Data Peminjam';
      case 'transaksi': return 'Transaksi';
      default: return 'INVENTA';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/20 backdrop-blur-lg border-b border-white/30 sticky top-0 z-40">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-linear-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-3">
                  <img src={image} alt='Inventa Logos'></img>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
                  <p className="text-gray-600 text-sm">
                    {getActiveSection() === 'dashboard' ? `Selamat datang, ${user?.username}!` : 'Sistem Manajemen Peminjaman'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right hidden md:block">
                  <p className="text-gray-700 font-medium">{user?.username}</p>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="hidden md:flex cursor-pointer items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-gray-700 hover:bg-white/30 transition-all duration-200"
                >
                  <IconLogout className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-32">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-max px-4">
        <FloatingDock
          items={customNavigationItems}
          desktopClassName="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl shadow-primary-500/20"
          mobileClassName="translate-y-10"
        />
      </div>

      {/* Additional Logout Button for Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={handleLogoutClick}
          className="p-2 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-200"
          title="Logout"
        >
          <IconLogout className="h-5 w-5" />
        </button>
      </div>

      {/* Profile Edit Modal */}
      <EditProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoading={logoutLoading}
      />
    </div>
  );
}
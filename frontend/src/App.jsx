import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import AlatBahan from './pages/AlatBahan';
import Peminjam from './pages/Peminjam';
import Transaksi from './pages/Transaksi';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading INVENTA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route 
          path="/login" 
          element={
            !user ? 
              <Login /> : 
              <Navigate to="/dashboard" />
          } 
        />
        <Route 
          path="/" 
          element={
            user ? 
              <Layout /> : 
              <Navigate to="/login" />
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alat-bahan" element={<AlatBahan />} />
          <Route path="peminjam" element={<Peminjam />} />
          <Route path="transaksi" element={<Transaksi />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
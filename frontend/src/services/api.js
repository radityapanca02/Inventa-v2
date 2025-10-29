import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor untuk menambahkan auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },

  async getUser() {
    const response = await api.get('/user');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};

// AlatBahan service functions
export const alatBahanService = {
  async getAll() {
    const response = await api.get('/alat-bahan');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/alat-bahan/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/alat-bahan', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/alat-bahan/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/alat-bahan/${id}`);
    return response.data;
  }
};

// Peminjam service functions
export const peminjamService = {
  async getAll() {
    const response = await api.get('/peminjam');
    return response.data;
  },

  async getWithStats() {
    const response = await api.get('/peminjam-with-stats');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/peminjam/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/peminjam', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/peminjam/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/peminjam/${id}`);
    return response.data;
  }
};

// Transaksi service functions
export const transaksiService = {
  async getAll() {
    const response = await api.get('/transaksi');
    return response.data;
  },

  async getActive() {
    const response = await api.get('/transaksi-active');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/transaksi/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/transaksi', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.put(`/transaksi/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/transaksi/${id}`);
    return response.data;
  },

  async returnItem(id) {
    const response = await api.post(`/transaksi/${id}/return`);
    return response.data;
  }
};
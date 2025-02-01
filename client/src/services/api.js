import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const createAPI = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add token to requests if it exists
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle token expiration
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

let api = createAPI();

// Function to reset API instance
export const resetAPI = () => {
  api = createAPI();
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData)
};

// Entries API
export const entriesAPI = {
  createEntry: (entryData) => api.post('/entries', entryData),
  getEntries: (params) => api.get('/entries', { params }),
  getEntry: (id) => api.get(`/entries/${id}`),
  updateEntry: (id, entryData) => api.put(`/entries/${id}`, entryData),
  deleteEntry: (id) => api.delete(`/entries/${id}`),
  getMoodStats: (params) => api.get('/entries/stats', { params })
};

export default api;

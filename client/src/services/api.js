import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error('API URL is not configured. Please check environment variables.');
}

// Create axios instance with default config
const createAPI = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
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
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Handle token expiration and other response errors
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error('Response error:', error);

      if (error.code === 'ECONNABORTED') {
        console.error('Request timed out');
        return Promise.reject(new Error('Request timed out. Please try again.'));
      }

      if (!error.response) {
        console.error('Network error');
        return Promise.reject(new Error('Network error. Please check your connection.'));
      }

      const { status } = error.response;

      if (status === 401) {
        console.error('Authentication error');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Authentication failed. Please log in again.'));
      }

      if (status === 403) {
        console.error('Authorization error');
        return Promise.reject(new Error('You do not have permission to perform this action.'));
      }

      if (status === 404) {
        console.error('Resource not found');
        return Promise.reject(new Error('The requested resource was not found.'));
      }

      if (status >= 500) {
        console.error('Server error');
        return Promise.reject(new Error('Server error. Please try again later.'));
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
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// Entries API
export const entriesAPI = {
  createEntry: async (entryData) => {
    try {
      const response = await api.post('/entries', entryData);
      return response.data;
    } catch (error) {
      console.error('Create entry error:', error);
      throw error;
    }
  },
  getEntries: async (params) => {
    try {
      const response = await api.get('/entries', { params });
      return response.data;
    } catch (error) {
      console.error('Get entries error:', error);
      throw error;
    }
  },
  getEntry: async (id) => {
    try {
      const response = await api.get(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get entry error:', error);
      throw error;
    }
  },
  updateEntry: async (id, entryData) => {
    try {
      const response = await api.put(`/entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      console.error('Update entry error:', error);
      throw error;
    }
  },
  deleteEntry: async (id) => {
    try {
      const response = await api.delete(`/entries/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete entry error:', error);
      throw error;
    }
  },
  getMoodStats: async (params) => {
    try {
      const response = await api.get('/entries/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Get mood stats error:', error);
      throw error;
    }
  }
};

export default api;

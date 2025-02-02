import axios from 'axios';
import Logger from '../utils/logger';
import { AppError, ErrorHandler } from '../utils/errorHandler';
import PerformanceMonitor from '../utils/performance';

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  Logger.error('Configuration Error', new Error('API URL is not configured'));
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
      Logger.startGroup('API Request');
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      Logger.network('request', {
        url: config.url,
        method: config.method,
        params: config.params,
        headers: {
          ...config.headers,
          Authorization: config.headers.Authorization ? 
            `Bearer ${config.headers.Authorization.split(' ')[1].substring(0, 10)}...` : 
            'none'
        }
      });

      return config;
    },
    (error) => {
      Logger.error('Request Interceptor Error', error);
      return Promise.reject(error);
    }
  );

  // Handle token expiration and other response errors
  instance.interceptors.response.use(
    (response) => {
      Logger.network('response', {
        url: response.config.url,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        size: JSON.stringify(response.data).length,
        performance: PerformanceMonitor.getMetrics()
      });
      Logger.endGroup();
      return response;
    },
    async (error) => {
      const errorDetails = {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        code: error.code
      };

      if (error.code === 'ECONNABORTED') {
        Logger.error('Timeout Error', error, errorDetails);
        return Promise.reject(new AppError('NET_002', 'Request timed out. Please try again.'));
      }

      if (!error.response) {
        Logger.error('Network Error', error, errorDetails);
        return Promise.reject(new AppError('NET_003', 'Network error. Please check your connection.'));
      }

      const { status } = error.response;

      if (status === 401) {
        Logger.error('Authentication Error', error, errorDetails);
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new AppError('AUTH_003', 'Authentication failed. Please log in again.'));
      }

      if (status === 403) {
        Logger.error('Authorization Error', error, errorDetails);
        return Promise.reject(new AppError('AUTH_004', 'You do not have permission to perform this action.'));
      }

      if (status === 404) {
        Logger.error('Not Found Error', error, errorDetails);
        return Promise.reject(new AppError('NET_001', 'The requested resource was not found.'));
      }

      if (status >= 500) {
        Logger.error('Server Error', error, errorDetails);
        return Promise.reject(new AppError('NET_001', 'Server error. Please try again later.'));
      }

      Logger.error('API Error', error, errorDetails);
      Logger.endGroup();
      return Promise.reject(error);
    }
  );

  return instance;
};

let api = createAPI();

// Function to reset API instance
export const resetAPI = () => {
  Logger.state('API Reset', {
    timestamp: new Date().toISOString()
  });
  api = createAPI();
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    Logger.startGroup('Register User');
    PerformanceMonitor.start('register');

    try {
      const response = await api.post('/auth/register', userData);
      Logger.state('Registration Success', {
        userId: response.data.user.id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'register',
        userData: { ...userData, password: '[REDACTED]' }
      });
      throw error;
    } finally {
      PerformanceMonitor.end('register');
      Logger.endGroup();
    }
  },

  login: async (credentials) => {
    Logger.startGroup('User Login');
    PerformanceMonitor.start('login');

    try {
      if (!credentials.email || !credentials.password) {
        throw new AppError('VAL_001', 'Email and password are required');
      }

      const response = await api.post('/auth/login', credentials);
      
      if (!response.data?.token || !response.data?.user) {
        throw new AppError('NET_004', 'Invalid response format from server');
      }

      Logger.state('Login Success', {
        userId: response.data.user.id,
        timestamp: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'login',
        credentials: { ...credentials, password: '[REDACTED]' }
      });
      throw error;
    } finally {
      PerformanceMonitor.end('login');
      Logger.endGroup();
    }
  },

  getProfile: async () => {
    Logger.startGroup('Get User Profile');
    PerformanceMonitor.start('getProfile');

    try {
      const response = await api.get('/auth/profile');
      Logger.state('Profile Fetch Success', {
        userId: response.data.user.id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'getProfile'
      });
      throw error;
    } finally {
      PerformanceMonitor.end('getProfile');
      Logger.endGroup();
    }
  },

  updateProfile: async (userData) => {
    Logger.startGroup('Update User Profile');
    PerformanceMonitor.start('updateProfile');

    try {
      const response = await api.put('/auth/profile', userData);
      Logger.state('Profile Update Success', {
        userId: response.data.user.id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'updateProfile',
        userData: { ...userData, password: '[REDACTED]' }
      });
      throw error;
    } finally {
      PerformanceMonitor.end('updateProfile');
      Logger.endGroup();
    }
  }
};

// Entries API
export const entriesAPI = {
  createEntry: async (entryData) => {
    Logger.startGroup('Create Entry');
    PerformanceMonitor.start('createEntry');

    try {
      const response = await api.post('/entries', entryData);
      Logger.state('Entry Creation Success', {
        entryId: response.data.entry.id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'createEntry',
        entryData
      });
      throw error;
    } finally {
      PerformanceMonitor.end('createEntry');
      Logger.endGroup();
    }
  },

  getEntries: async (params) => {
    Logger.startGroup('Get Entries');
    PerformanceMonitor.start('getEntries');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new AppError('AUTH_001', 'No authentication token found');
      }

      const validatedParams = {
        page: params?.page || 1,
        limit: Math.min(params?.limit || 50, 100),
        sort: params?.sort || 'date',
        order: params?.order || 'desc',
        timestamp: Date.now()
      };

      Logger.state('Fetch Entries Request', {
        params: validatedParams,
        timestamp: new Date().toISOString()
      });

      const response = await api.get('/entries', {
        params: validatedParams,
        timeout: 15000,
        validateStatus: status => status === 200
      });

      if (!response.data || typeof response.data !== 'object') {
        throw new AppError('NET_004', 'Invalid response format - not an object');
      }

      if (!Array.isArray(response.data.entries)) {
        throw new AppError('NET_004', 'Invalid response format - entries not an array');
      }

      response.data.entries.forEach((entry, index) => {
        if (!entry.id || !entry.title || !entry.content || !entry.mood || !entry.date) {
          throw new AppError('NET_004', `Invalid entry format at index ${index}`);
        }
      });

      response.data.pagination = response.data.pagination || {
        total: response.data.entries.length,
        page: validatedParams.page,
        pages: Math.ceil(response.data.entries.length / validatedParams.limit)
      };

      Logger.state('Fetch Entries Success', {
        count: response.data.entries.length,
        pagination: response.data.pagination,
        performance: PerformanceMonitor.getMetrics()
      });

      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'getEntries',
        params
      });

      if (error.response?.status === 404) {
        return { entries: [], pagination: { total: 0, page: 1, pages: 1 } };
      }

      throw error;
    } finally {
      PerformanceMonitor.end('getEntries');
      Logger.endGroup();
    }
  },

  getEntry: async (id) => {
    Logger.startGroup('Get Single Entry');
    PerformanceMonitor.start('getEntry');

    try {
      const response = await api.get(`/entries/${id}`);
      Logger.state('Entry Fetch Success', {
        entryId: id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'getEntry',
        entryId: id
      });
      throw error;
    } finally {
      PerformanceMonitor.end('getEntry');
      Logger.endGroup();
    }
  },

  updateEntry: async (id, entryData) => {
    Logger.startGroup('Update Entry');
    PerformanceMonitor.start('updateEntry');

    try {
      const response = await api.put(`/entries/${id}`, entryData);
      Logger.state('Entry Update Success', {
        entryId: id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'updateEntry',
        entryId: id,
        entryData
      });
      throw error;
    } finally {
      PerformanceMonitor.end('updateEntry');
      Logger.endGroup();
    }
  },

  deleteEntry: async (id) => {
    Logger.startGroup('Delete Entry');
    PerformanceMonitor.start('deleteEntry');

    try {
      const response = await api.delete(`/entries/${id}`);
      Logger.state('Entry Deletion Success', {
        entryId: id,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'deleteEntry',
        entryId: id
      });
      throw error;
    } finally {
      PerformanceMonitor.end('deleteEntry');
      Logger.endGroup();
    }
  },

  getMoodStats: async (params) => {
    Logger.startGroup('Get Mood Stats');
    PerformanceMonitor.start('getMoodStats');

    try {
      const response = await api.get('/entries/stats', { params });
      Logger.state('Mood Stats Fetch Success', {
        params,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      ErrorHandler.handle(error, {
        operation: 'getMoodStats',
        params
      });
      throw error;
    } finally {
      PerformanceMonitor.end('getMoodStats');
      Logger.endGroup();
    }
  }
};

export default api;

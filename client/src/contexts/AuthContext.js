import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  profileChecked: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  getProfile: async () => {},
  clearError: () => {}
});

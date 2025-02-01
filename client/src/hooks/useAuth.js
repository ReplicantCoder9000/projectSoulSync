import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, logout, getProfile, clearError } from '../store/slices/authSlice.js';
import { AuthContext } from '../components/auth/AuthProvider.jsx';

export const useAuth = () => {
  const context = useContext(AuthContext);
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  if (context) return context;

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleGetProfile = async () => {
    try {
      await dispatch(getProfile()).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    getProfile: handleGetProfile,
    clearError: handleClearError
  };
};

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, logout, getProfile, clearError } from '../store/slices/authSlice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const handleRegister = useCallback(
    async (userData) => {
      try {
        await dispatch(register(userData)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (credentials) => {
      try {
        await dispatch(login(credentials)).unwrap();
        return true;
      } catch {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleGetProfile = useCallback(async () => {
    try {
      await dispatch(getProfile()).unwrap();
      return true;
      } catch {
      return false;
    }
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

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

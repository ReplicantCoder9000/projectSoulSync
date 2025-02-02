import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, logout, getProfile, clearError } from '../store/slices/authSlice.js';
import { AuthContext } from '../components/auth/AuthProvider.jsx';

export const useAuth = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const context = useContext(AuthContext);

  // Return context if available (for components within AuthProvider)
  if (context) return context;

  // Fallback to Redux state and actions
  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      console.error('Login error:', error);
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
    } catch (error) {
      console.error('Get profile error:', error);
      return false;
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...authState,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    getProfile: handleGetProfile,
    clearError: handleClearError,
    profileChecked: false // Default value when outside AuthProvider
  };
};

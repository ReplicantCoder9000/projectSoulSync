import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { register, login, logout, getProfile, clearError } from '../../store/slices/authSlice.js';
import { AuthContext } from '../../contexts/AuthContext';

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.profileChecked) {
      dispatch(getProfile());
    }
  }, [dispatch, auth.profileChecked]);

  const handleLogin = async (credentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await dispatch(register(userData)).unwrap();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
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

  const value = {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getProfile: handleGetProfile,
    clearError: handleClearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;

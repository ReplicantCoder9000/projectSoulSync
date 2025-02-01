import { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../store/slices/authSlice.js';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  profileChecked: false
});

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !auth.profileChecked) {
      dispatch(getProfile());
    }
  }, [dispatch, auth.profileChecked]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;

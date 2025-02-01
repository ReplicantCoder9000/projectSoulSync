import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from '../../store/slices/authSlice.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { isAuthenticated } = auth;
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkProfile = async () => {
      if (isAuthenticated && !profileChecked) {
        try {
          await dispatch(getProfile()).unwrap();
          if (mounted) {
            setProfileChecked(true);
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      }
    };

    checkProfile();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, profileChecked, dispatch]);

  return (
    <AuthContext.Provider value={{ ...auth, profileChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthProvider;

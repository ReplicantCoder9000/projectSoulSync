import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth as useReduxAuth } from '../../hooks/useAuth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useReduxAuth();
  const { isAuthenticated, getProfile } = auth;
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkProfile = async () => {
      if (isAuthenticated && !profileChecked) {
        try {
          await getProfile();
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
  }, [isAuthenticated, getProfile, profileChecked]);

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

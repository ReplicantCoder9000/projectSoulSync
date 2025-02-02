import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Link,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingState from '../ui/LoadingState.jsx';
import RetroWindow from '../ui/RetroWindow.jsx';
import ActionButton from '../ui/ActionButton.jsx';
import {
  Win95Background,
  RetroTextField,
  RetroAlert,
  FormContainer,
  commonTypographyStyles,
  commonButtonStyles,
  commonWindowStyles
} from './styles.js';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setShowAlert(false); // Reset alert state
      try {
        console.log('Attempting login...', values.email);
        const success = await login(values);
        console.log('Login response:', success);
        if (success) {
          navigate(from, { replace: true });
        } else {
          console.error('Login failed without throwing error');
          setShowAlert(true);
        }
      } catch (err) {
        console.error('Login error:', err);
        setShowAlert(true);
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleAlertClose = () => {
    setShowAlert(false);
    clearError();
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Win95Background>
      <RetroWindow
        title="Sign In to SoulSync"
        sx={commonWindowStyles}
      >
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="body2"
            sx={commonTypographyStyles.title}
          >
            SYSTEM STATUS: ONLINE
          </Typography>
          <Typography
            variant="body2"
            sx={commonTypographyStyles.subtitle}
          >
            Please enter your credentials
          </Typography>

          <LoadingState loading={loading} error={null}>
            <FormContainer
              component="form"
              onSubmit={formik.handleSubmit}
            >
              {(showAlert || error) && (
                <RetroAlert severity="error" onClose={handleAlertClose} sx={{ mb: 1 }}>
                  {typeof error === 'string' ? error : 'Invalid credentials. Please check your email and password.'}
                </RetroAlert>
              )}

              <RetroTextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.email)}
                helperText={formik.errors.email}
                inputProps={{
                  'aria-label': 'Email Address'
                }}
                autoComplete="username"
              />

              <RetroTextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.password)}
                helperText={formik.errors.password}
                inputProps={{
                  'aria-label': 'Password'
                }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                        sx={{
                          width: 16,
                          height: 16,
                          margin: 0,
                          padding: 0,
                          '& .MuiSvgIcon-root': {
                            fontSize: 14
                          }
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <ActionButton
                type="submit"
                fullWidth
                variant="contained"
                size="small"
                sx={commonButtonStyles.button}
                disabled={formik.isSubmitting || loading}
              >
                {loading ? 'Signing in...' : 'OK'}
              </ActionButton>

              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body2"
                  sx={commonTypographyStyles.link}
                >
                  Don&apos;t have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </FormContainer>
          </LoadingState>
        </Box>
      </RetroWindow>
    </Win95Background>
  );
};

export default Login;

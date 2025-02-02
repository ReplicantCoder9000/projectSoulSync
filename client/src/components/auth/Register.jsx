import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register: handleRegister, loading, error, clearError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const success = await handleRegister({
          username: values.username,
          email: values.email,
          password: values.password
        });

        if (success) {
          navigate('/dashboard');
        } else {
          setShowAlert(true);
        }
      } catch (err) {
        setShowAlert(true);
        if (err.response?.data?.error?.message) {
          const errorMessage = err.response.data.error.message.toLowerCase();
          if (errorMessage.includes('email')) {
            setFieldError('email', 'Email already exists');
          } else if (errorMessage.includes('username')) {
            setFieldError('username', 'Username already exists');
          } else {
            console.error('Registration error:', err);
          }
        }
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

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Win95Background>
      <RetroWindow
        title="Create Account"
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
            Join us on your journey to better mental well-being
          </Typography>

          <LoadingState loading={loading} error={null}>
            <FormContainer
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              {showAlert && error && (
                <RetroAlert severity="error" onClose={handleAlertClose} sx={{ mb: 1 }}>
                  {typeof error === 'string' ? error : 'Registration failed'}
                </RetroAlert>
              )}

              <RetroTextField
                fullWidth
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                inputProps={{
                  'aria-label': 'Username',
                  maxLength: 50
                }}
                autoComplete="username"
              />

              <RetroTextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                inputProps={{
                  'aria-label': 'Email Address',
                  maxLength: 100
                }}
                autoComplete="email"
                sx={{ mt: 2 }}
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
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                inputProps={{
                  'aria-label': 'Password',
                  maxLength: 50
                }}
                autoComplete="new-password"
                sx={{ mt: 2 }}
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

              <RetroTextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                inputProps={{
                  'aria-label': 'Confirm Password',
                  maxLength: 50
                }}
                autoComplete="new-password"
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleToggleConfirmPassword}
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
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                sx={{ ...commonButtonStyles.button, mt: 3 }}
                disabled={loading || formik.isSubmitting}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </ActionButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography 
                  variant="body2"
                  sx={commonTypographyStyles.link}
                >
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign in
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

export default Register;

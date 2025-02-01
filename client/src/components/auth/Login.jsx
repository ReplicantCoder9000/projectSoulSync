import { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Link,
  Alert,
  styled,
  useTheme,
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

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Win95Background = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  backgroundImage: `
    linear-gradient(45deg, ${theme.palette.background.paper} 25%, transparent 25%),
    linear-gradient(-45deg, ${theme.palette.background.paper} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${theme.palette.background.paper} 75%),
    linear-gradient(-45deg, transparent 75%, ${theme.palette.background.paper} 75%)
  `,
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  padding: theme.spacing(2)
}));

const RetroTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '22px',
    '& input': {
      padding: '2px 8px',
      height: '18px',
      fontSize: '12px',
      fontFamily: '"Microsoft Sans Serif", system-ui',
      '&::placeholder': {
        fontSize: '12px',
        opacity: 0.7
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontSize: '12px',
    transform: 'translate(8px, -6px) scale(0.75)',
    '&.Mui-focused': {
      color: theme.palette.text.primary
    }
  },
  '& .MuiFormHelperText-root': {
    fontSize: '11px',
    marginTop: '2px',
    fontFamily: '"Microsoft Sans Serif", system-ui'
  }
}));

const RetroAlert = styled(Alert)(({ theme }) => ({
  fontFamily: '"Microsoft Sans Serif", system-ui',
  fontSize: '12px',
  padding: '6px 8px',
  borderRadius: 0,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.error.main,
  boxShadow: theme.shadows.field,
  '& .MuiAlert-icon': {
    fontSize: '16px',
    padding: 0
  }
}));

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const theme = useTheme();

  const from = location.state?.from?.pathname || '/dashboard';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const success = await login(values);
        if (success) {
          navigate(from, { replace: true });
        } else {
          setShowAlert(true);
        }
      } catch {
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
        sx={{
          width: '100%',
          maxWidth: 280
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              mb: 1,
              fontFamily: '"Microsoft Sans Serif", system-ui',
              fontSize: '12px'
            }}
          >
            Please enter your credentials
          </Typography>

          <LoadingState loading={loading} error={null}>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{
                width: '100%',
                '& .MuiTextField-root': {
                  mb: 1
                }
              }}
            >
              {showAlert && error && (
                <RetroAlert severity="error" onClose={handleAlertClose} sx={{ mb: 1 }}>
                  {typeof error === 'string' ? error : 'Invalid credentials'}
                </RetroAlert>
              )}

              <RetroTextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <RetroTextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
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
                sx={{ mt: 1, mb: 1 }}
                disabled={formik.isSubmitting || loading}
              >
                {loading ? 'Signing in...' : 'OK'}
              </ActionButton>

              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="body2"
                  sx={{
                    fontFamily: '"Microsoft Sans Serif", system-ui',
                    fontSize: '11px'
                  }}
                >
                  Don&apos;t have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{
                      color: theme.palette.primary.main,
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
            </Box>
          </LoadingState>
        </Box>
      </RetroWindow>
    </Win95Background>
  );
};

export default Login;

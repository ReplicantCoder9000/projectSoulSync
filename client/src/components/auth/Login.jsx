import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Link,
  Alert,
  styled,
  keyframes,
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

const bootAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const RetroBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.palette.mode === 'dark' 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    : 'linear-gradient(135deg, #F8F8FF 0%, #E6E6FA 100%)',
  overflow: 'hidden',
  animation: `${bootAnimation} 1s ease-out`
}));

const RetroTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '18px',
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    border: '2px solid',
    borderColor: theme.palette.mode === 'dark' ? '#4A4A4A' : '#C0C0C0',
    boxShadow: '2px 2px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease-in-out',
    height: '45px',
    '& fieldset': {
      borderWidth: 0
    },
    '&:hover': {
      transform: 'translateY(-1px)',
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused': {
      borderColor: theme.palette.secondary.main,
      boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '18px',
    color: theme.palette.mode === 'dark' ? '#888' : '#666',
    transform: 'translate(14px, 12px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
      color: theme.palette.primary.main
    }
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '14px',
    marginTop: '4px'
  }
}));

const RetroAlert = styled(Alert)(({ theme }) => ({
  fontFamily: '"VT323", monospace',
  fontSize: '16px',
  padding: '4px 8px',
  border: '2px solid',
  borderColor: theme.palette.error.main,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
  boxShadow: '2px 2px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
  '& .MuiAlert-icon': {
    color: theme.palette.error.main,
    padding: '4px 0'
  }
}));

const Login = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const theme = useTheme();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    <Container maxWidth="sm" sx={{ px: 0 }}>
      <RetroBackground>
        <RetroWindow
          title="💫 Welcome Back"
          sx={{
            width: '100%',
            maxWidth: 400,
            mx: 2
          }}
        >
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 0.5,
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '12px',
                color: 'primary.main',
                textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)',
                opacity: isBooting ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              SYSTEM STATUS: {isBooting ? 'BOOTING...' : 'ONLINE'}
            </Typography>
            <Typography
              color="text.secondary"
              gutterBottom
              sx={{
                textAlign: 'center',
                mb: 2,
                fontFamily: '"VT323", monospace',
                fontSize: '18px',
                opacity: isBooting ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
                textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              Please sign in to continue
            </Typography>
          </Box>

          <LoadingState loading={loading} error={null}>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{
                width: '100%',
                mt: 1,
                '& .MuiTextField-root': {
                  mb: 1.5
                }
              }}
            >
              {showAlert && error && (
                <RetroAlert severity="error" onClose={handleAlertClose} sx={{ mb: 1.5 }}>
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
                          color: theme.palette.mode === 'dark' ? '#888' : '#666',
                          '&:hover': {
                            color: theme.palette.primary.main
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
                size="large"
                sx={{
                  mt: 2,
                  mb: 1.5,
                  height: '40px',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '12px',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)'
                    : 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #FF69B4 30%, #FFB6C1 90%)'
                      : 'linear-gradient(45deg, #FF1493 30%, #FF69B4 90%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)'
                  }
                }}
                disabled={formik.isSubmitting || loading}
              >
                {loading ? 'CONNECTING...' : 'SIGN IN'}
              </ActionButton>

              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontFamily: '"VT323", monospace',
                    fontSize: '16px'
                  }}
                >
                  Don&apos;t have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/register"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      textShadow: '1px 1px 0 rgba(255, 105, 180, 0.2)',
                      '&:hover': {
                        color: 'secondary.main',
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
        </RetroWindow>
      </RetroBackground>
    </Container>
  );
};

export default Login;

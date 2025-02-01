import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Link,
  Alert,
  styled,
  keyframes
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingState from '../ui/LoadingState.jsx';
import RetroWindow from '../ui/RetroWindow.jsx';
import ActionButton from '../ui/ActionButton.jsx';

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
    .required('Please confirm your password')
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

const scanlineAnimation = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
`;

const flickerAnimation = keyframes`
  0%, 100% { opacity: 0.99; }
  50% { opacity: 0.95; }
`;

const RetroBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.gradients.auth,
  overflow: 'hidden',
  animation: `${bootAnimation} 1s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
    backgroundSize: '100% 2px',
    animation: `${scanlineAnimation} 8s linear infinite`,
    opacity: 0.1,
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
    opacity: 0.1,
    animation: `${flickerAnimation} 4s ease-in-out infinite`,
    pointerEvents: 'none'
  }
}));

const RetroTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid',
    borderColor: theme.palette.mode === 'light' ? '#C0C0C0' : '#4A4A4A',
    boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': {
      borderWidth: 0
    },
    '&:hover': {
      transform: 'translateY(-1px)',
      borderColor: theme.palette.primary.main
    },
    '&.Mui-focused': {
      borderColor: theme.palette.secondary.main,
      boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 0
      }
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '20px',
    color: theme.palette.primary.main
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"VT323", monospace',
    fontSize: '16px',
    marginTop: '8px'
  }
}));

const RetroAlert = styled(Alert)(({ theme }) => ({
  fontFamily: '"VT323", monospace',
  fontSize: '18px',
  border: '2px solid',
  borderColor: theme.palette.error.main,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
  '& .MuiAlert-icon': {
    color: theme.palette.error.main
  }
}));

const Register = () => {
  const [isBooting, setIsBooting] = useState(true);
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const success = await register(values);
      if (success) {
        navigate('/dashboard');
      } else {
        setShowAlert(true);
      }
    }
  });

  const handleAlertClose = () => {
    setShowAlert(false);
    clearError();
  };

  return (
    <Container maxWidth="sm" sx={{ px: 0 }}>
      <RetroBackground>
        <RetroWindow
          title="✨ Create Account"
          sx={{
            width: '100%',
            maxWidth: 'sm',
            mx: 2
          }}
        >
          <Box sx={{ position: 'relative', width: '100%' }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: 'center',
                mb: 1,
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '14px',
                color: 'primary.main',
                textShadow: '2px 2px 0 rgba(255, 105, 180, 0.2)',
                opacity: isBooting ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out'
              }}
            >
              SYSTEM STATUS: {isBooting ? 'BOOTING...' : 'READY'}
            </Typography>
            <Typography
              color="text.secondary"
              gutterBottom
              sx={{
                textAlign: 'center',
                mb: 4,
                fontFamily: '"VT323", monospace',
                fontSize: '20px',
                opacity: isBooting ? 0 : 1,
                transition: 'opacity 0.5s ease-in-out',
                textShadow: '1px 1px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              Join us on your journey to better mental well-being
            </Typography>
          </Box>

          <LoadingState loading={loading} error={null}>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              sx={{
                width: '100%',
                mt: 2,
                '& .MuiTextField-root': {
                  mb: 2.5
                }
              }}
            >
              {showAlert && error && (
                <RetroAlert severity="error" onClose={handleAlertClose} sx={{ mb: 2 }}>
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
                margin="normal"
              />

              <RetroTextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                margin="normal"
              />

              <RetroTextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
              />

              <RetroTextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                margin="normal"
              />

              <ActionButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  mb: 2,
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '14px',
                  background: (theme) => theme.gradients.neon,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  boxShadow: '3px 3px 0 rgba(0,0,0,0.2), -1px -1px 0 rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: (theme) => theme.gradients.electric,
                    transform: 'translateY(-2px)',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.2), -2px -2px 0 rgba(255,255,255,0.2)'
                  }
                }}
                disabled={loading}
              >
                {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </ActionButton>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontFamily: '"VT323", monospace',
                    fontSize: '18px'
                  }}
                >
                  Already have an account?{' '}
                  <Link 
                    component={RouterLink} 
                    to="/login"
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
                    Sign in
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

export default Register;

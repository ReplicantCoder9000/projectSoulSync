import { useState } from 'react';
import { gradients } from '../../styles/theme.js';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Paper
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingState from '../ui/LoadingState.jsx';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
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
    onSubmit: async (values) => {
      const success = await login(values);
      if (success) {
        navigate(from, { replace: true });
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
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: gradients.auth,
          px: 3,
          mx: -3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'background.paper',
            backdropFilter: 'blur(8px)',
            borderRadius: 3,
            boxShadow: (theme) => theme.shadows.strong,
            border: '1px solid',
            borderColor: 'divider',
            width: '100%',
            maxWidth: 'sm'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              textAlign: 'center',
              mb: 0.5
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            color="text.secondary"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontSize: '1rem'
            }}
          >
            Please sign in to continue
          </Typography>

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
                <Alert severity="error" onClose={handleAlertClose} sx={{ mb: 2 }}>
                  {typeof error === 'string' ? error : 'Invalid credentials'}
                </Alert>
              )}

              <TextField
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
                margin="normal"
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                margin="normal"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign In
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{' '}
                  <Link component={RouterLink} to="/register">
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </LoadingState>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

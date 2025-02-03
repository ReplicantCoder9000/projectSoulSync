import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/auth/AuthProvider.jsx';
import ThemeProvider from './components/providers/ThemeProvider.jsx';
import SettingsProvider from './components/providers/SettingsProvider.jsx';
import CssBaseline from '@mui/material/CssBaseline';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Auth Pages
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';

// Protected Pages
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import Settings from './pages/Settings';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <CssBaseline />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="new-entry" element={<NewEntry />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import AuthProvider from './components/auth/AuthProvider.jsx';
import ThemeProvider from './components/providers/ThemeProvider.jsx';
import SettingsProvider from './components/providers/SettingsProvider.jsx';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store/index.js';

// Layout
import MainLayout from './components/layout/MainLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Auth Pages
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';

// Protected Pages
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
const Entries = () => <div>Entries</div>;
const Stats = () => <div>Stats</div>;
import Settings from './pages/Settings';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
        <CssBaseline />
        <Router>
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
              <Route path="entries" element={<Entries />} />
              <Route path="stats" element={<Stats />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        </ThemeProvider>
      </SettingsProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default App;

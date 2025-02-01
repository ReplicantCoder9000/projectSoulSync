import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Button,
  Stack,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Notifications,
  RestartAlt,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSettings } from '../hooks/useSettings';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const Settings = () => {
  const { settings, setTheme, setNotifications, setPreferences, resetSettings } = useSettings();
  const [showResetAlert, setShowResetAlert] = useState(false);

  const handleThemeChange = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleNotificationChange = (event) => {
    setNotifications({
      ...settings.notifications,
      enabled: event.target.checked
    });
  };

  const handleReminderTimeChange = (event) => {
    setNotifications({
      ...settings.notifications,
      reminderTime: event.target.value
    });
  };

  const handleFrequencyChange = (event) => {
    setNotifications({
      ...settings.notifications,
      frequency: event.target.value
    });
  };

  const handleDefaultViewChange = (event) => {
    setPreferences({
      ...settings.preferences,
      defaultView: event.target.value
    });
  };

  const handleChartTypeChange = (event) => {
    setPreferences({
      ...settings.preferences,
      chartType: event.target.value
    });
  };

  const handleEntriesPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value >= 5 && value <= 50) {
      setPreferences({
        ...settings.preferences,
        entriesPerPage: value
      });
    }
  };

  const handleReset = () => {
    resetSettings();
    setShowResetAlert(true);
    setTimeout(() => setShowResetAlert(false), 3000);
  };

  return (
    <Box
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ maxWidth: 800, mx: 'auto', py: 3 }}
    >
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Stack spacing={3}>
        {/* Theme Settings */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h6">Theme</Typography>
            <IconButton
              color="primary"
              onClick={handleThemeChange}
              size="small"
            >
              {settings.theme === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={settings.theme === 'dark'}
                onChange={handleThemeChange}
              />
            }
            label={`${settings.theme === 'light' ? 'Light' : 'Dark'} Mode`}
          />
        </Paper>

        {/* Notification Settings */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h6">Notifications</Typography>
            <Notifications color="primary" />
          </Stack>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notifications.enabled}
                  onChange={handleNotificationChange}
                />
              }
              label="Enable Notifications"
            />
            <TextField
              label="Reminder Time"
              type="time"
              value={settings.notifications.reminderTime}
              onChange={handleReminderTimeChange}
              disabled={!settings.notifications.enabled}
              InputLabelProps={{ shrink: true }}
            />
            <Select
              value={settings.notifications.frequency}
              onChange={handleFrequencyChange}
              disabled={!settings.notifications.enabled}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </Stack>
        </Paper>

        {/* Personalization Settings */}
        <Paper
          component={motion.div}
          variants={itemVariants}
          sx={{ p: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h6">Personalization</Typography>
            <Tooltip title="Customize your journal experience">
              <InfoIcon color="primary" />
            </Tooltip>
          </Stack>
          <Stack spacing={2}>
            <Select
              value={settings.preferences.defaultView}
              onChange={handleDefaultViewChange}
              label="Default View"
            >
              <MenuItem value="entries">Entries</MenuItem>
              <MenuItem value="stats">Statistics</MenuItem>
            </Select>
            <Select
              value={settings.preferences.chartType}
              onChange={handleChartTypeChange}
              label="Chart Type"
            >
              <MenuItem value="pie">Pie Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
            </Select>
            <TextField
              label="Entries per Page"
              type="number"
              value={settings.preferences.entriesPerPage}
              onChange={handleEntriesPerPageChange}
              inputProps={{ min: 5, max: 50 }}
            />
          </Stack>
        </Paper>

        <Divider />

        {/* Reset Settings */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<RestartAlt />}
            onClick={handleReset}
            color="error"
            variant="outlined"
          >
            Reset All Settings
          </Button>
        </Box>

        {/* Reset Alert */}
        {showResetAlert && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Settings have been reset to defaults
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

export default Settings;

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTheme,
  setNotifications,
  setPreferences,
  resetSettings
} from '../store/slices/settingsSlice.js';

export const useSettings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  const handleSetTheme = useCallback(
    (theme) => {
      dispatch(setTheme(theme));
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
    },
    [dispatch]
  );

  const handleSetNotifications = useCallback(
    (notifications) => {
      dispatch(setNotifications(notifications));
    },
    [dispatch]
  );

  const handleSetPreferences = useCallback(
    (preferences) => {
      dispatch(setPreferences(preferences));
    },
    [dispatch]
  );

  const handleResetSettings = useCallback(() => {
    dispatch(resetSettings());
    // Reset theme
    document.documentElement.setAttribute('data-theme', 'light');
  }, [dispatch]);

  return {
    settings,
    setTheme: handleSetTheme,
    setNotifications: handleSetNotifications,
    setPreferences: handleSetPreferences,
    resetSettings: handleResetSettings
  };
};

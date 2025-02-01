import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { loadSavedSettings } from '../../store/slices/settingsSlice.js';

// Load settings from localStorage
const loadSettings = () => {
  try {
    const savedSettings = localStorage.getItem('moodJournalSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return null;
};

const SettingsProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Initialize settings from localStorage
  useEffect(() => {
    const savedSettings = loadSettings();
    if (savedSettings) {
      dispatch(loadSavedSettings(savedSettings));
    }
  }, [dispatch]);

  // Save settings to localStorage when they change
  useEffect(() => {
    const handleStorageUpdate = () => {
      const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
        window.__REDUX_DEVTOOLS_EXTENSION__.getState() : null;
      if (state?.settings) {
        localStorage.setItem('moodJournalSettings', JSON.stringify(state.settings));
      }
    };

    window.addEventListener('redux-store-updated', handleStorageUpdate);
    return () => window.removeEventListener('redux-store-updated', handleStorageUpdate);
  }, []);

  return children;
};

SettingsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default SettingsProvider;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  notifications: {
    enabled: true,
    reminderTime: '20:00', // Default reminder at 8 PM
    frequency: 'daily'
  },
  preferences: {
    defaultView: 'entries', // or 'stats'
    chartType: 'pie', // or 'bar'
    entriesPerPage: 10
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    loadSavedSettings: (_, action) => {
      return action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = {
        ...state.notifications,
        ...action.payload
      };
    },
    setPreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload
      };
    },
    resetSettings: () => initialState
  }
});

export const {
  setTheme,
  setNotifications,
  setPreferences,
  resetSettings,
  loadSavedSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import entriesReducer from './slices/entriesSlice.js';
import settingsReducer from './slices/settingsSlice.js';

// Create a custom middleware to dispatch events on state changes
const stateChangeMiddleware = () => (next) => (action) => {
  const result = next(action);
  // Dispatch custom event for state changes
  window.dispatchEvent(new CustomEvent('redux-store-updated'));
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    entries: entriesReducer,
    settings: settingsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.date', 'meta.arg.date'],
        // Ignore these paths in the state
        ignoredPaths: ['entries.currentEntry.date', 'auth.user.lastLogin']
      }
    }).concat(stateChangeMiddleware),
  devTools: import.meta.env.MODE !== 'production'
});

export default store;

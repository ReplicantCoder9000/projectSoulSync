import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import entriesReducer from './slices/entriesSlice.js';
import settingsReducer from './slices/settingsSlice.js';

// Create a custom middleware to dispatch events and log state changes
const stateChangeMiddleware = (store) => (next) => (action) => {
  console.log('Redux: Dispatching action:', action.type, {
    payload: action.payload,
    meta: action.meta,
    error: action.error
  });
  
  const result = next(action);
  const newState = store.getState();
  
  if (action.type.startsWith('entries/')) {
    console.log('Redux Entries: Action result:', {
      type: action.type,
      success: !action.error,
      entries: newState.entries.entries,
      loading: newState.entries.loading,
      error: newState.entries.error
    });
  }
  
  console.log('Redux: New state:', {
    auth: {
      isAuthenticated: newState.auth.isAuthenticated,
      loading: newState.auth.loading,
      error: newState.auth.error
    },
    entries: {
      count: newState.entries.entries?.length || 0,
      loading: newState.entries.loading,
      error: newState.entries.error
    }
  });
  
  window.dispatchEvent(new CustomEvent('redux-store-updated'));
  return result;
};

// Create a middleware to log API errors
const apiErrorMiddleware = () => (next) => (action) => {
  if (action.type?.endsWith('/rejected')) {
    console.error('Redux API Error:', {
      type: action.type,
      error: action.error,
      payload: action.payload,
      meta: action.meta,
      requestId: action.meta?.requestId,
      args: action.meta?.arg
    });
    
    if (action.type.startsWith('entries/')) {
      console.error('Redux Entries Error Details:', {
        endpoint: action.meta?.arg?.endpoint,
        params: action.meta?.arg?.params,
        response: action.payload,
        status: action.error?.response?.status
      });
    }
  }
  return next(action);
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
    }).concat(stateChangeMiddleware, apiErrorMiddleware),
  devTools: import.meta.env.MODE !== 'production'
});

export default store;

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store/index.js';
import App from './App.jsx';
import './styles/index.css';

// Import Y2K fonts
import '@fontsource/press-start-2p/400.css';
import '@fontsource/vt323/400.css';
import '@fontsource/orbitron/400.css';
import '@fontsource/orbitron/500.css';
import '@fontsource/orbitron/700.css';

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Wrap app with providers in correct order:
// 1. Redux Provider (for global state)
// 2. App (which contains Router, Theme, Settings, and Auth providers)
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  </React.StrictMode>
);

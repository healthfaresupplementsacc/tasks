// Polyfill window.storage (Claude artifact API) → localStorage
// Must run before App mounts so any useEffect storage calls find the shim.
if (!window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value === null ? undefined : { value };
    },
    async set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.warn('[storage shim] Failed to persist:', key, e);
      }
    },
  };
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

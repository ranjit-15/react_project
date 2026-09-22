// main.jsx
// The very first JavaScript file the browser runs.
// It finds the <div id="root"> in index.html and mounts the React app inside it.
// StrictMode is a development helper — it runs components twice to catch subtle bugs.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';     // Global styles must be imported here
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

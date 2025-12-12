// src/index.js (CORRECTED)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 1. Import Router
import { BrowserRouter as Router } from 'react-router-dom'; 
// 2. Import AuthProvider
import { AuthProvider } from './context/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 3. Wrap everything in the Router */}
    <Router>
      {/* 4. Wrap everything in the AuthProvider */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
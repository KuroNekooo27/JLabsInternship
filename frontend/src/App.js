// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Screens and Components
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ProtectedRoute from './components/ProtectedRoute'; // The gatekeeper component

function App() {
    return (
        <Routes>
            {/* Public route: Anyone can access the login page */}
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Redirect on app open logic: If the path is just '/', check auth status */}
            {/* If logged in, the ProtectedRoute handles the navigation to /home */}
            <Route path="/" element={<ProtectedRoute />}>
                {/* Protected route: Only authenticated users can see this */}
                <Route path="home" element={<HomeScreen />} /> 
                {/* Redirect the root path to home if logged in */}
                <Route index element={<HomeScreen />} /> 
            </Route>
            
            {/* Fallback for unknown paths */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
    );
}

export default App;
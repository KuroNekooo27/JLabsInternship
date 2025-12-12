// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Do nothing while loading the token check
    if (loading) {
        return <div>Loading...</div>; 
    }

    // If authenticated, render the children (Home Screen)
    // Outlet is used when defining routes in the parent component
    if (isAuthenticated) {
        return <Outlet />;
    }

    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
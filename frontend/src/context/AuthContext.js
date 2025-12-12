// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context object
const AuthContext = createContext();

// Hook for using the context
export const useAuth = () => useContext(AuthContext);

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
    // State to hold authentication info
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // For initial loading check

    // Function to handle login
    const login = (newToken) => {
        localStorage.setItem('token', newToken); // Persist token
        setToken(newToken);
        setIsAuthenticated(true);
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('token'); // Clear token
        setToken(null);
        setIsAuthenticated(false);
    };

    // 3. Effect to check for stored token on app load (Requirement: "On every app open...")
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // NOTE: In a real app, you'd validate this token against your API here.
            // For this project, we assume if a token exists, the user is logged in.
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        setLoading(false); // Finished checking for token
    }, []);

    const contextValue = {
        isAuthenticated,
        token,
        loading,
        login,
        logout,
    };

    if (loading) {
        return <div>Loading app...</div>; // Simple loading state while checking token
    }
    
    // 4. Provide the state and functions to children
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
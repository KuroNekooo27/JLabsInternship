import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Set the base URL for the API
// const API_URL = 'http://localhost:8000/api/login'; 
const API_URL = ''; 

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();

    // If the user is already authenticated, redirect them to the home screen immediately
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        // Basic Client-Side Validation
        if (!email || !password) {
            return setError('Please enter both email and password.');
        }

        setLoading(true);

        try {
            const response = await axios.post(API_URL, { email, password });
            const token = response.data.token;
            login(token); 
            navigate('/home', { replace: true });
        } catch (err) {
            const errorMessage = err.response?.data?.msg || 'Login failed due to a server error.';
            setError(errorMessage);
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            <p>Use Email: `test@example.com` | Password: `password123`</p>
            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <p style={styles.error}>{error}</p>}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    disabled={loading}
                />
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd' },
    button: { padding: '10px', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' },
    error: { color: 'red', textAlign: 'center' },
};

export default LoginScreen;
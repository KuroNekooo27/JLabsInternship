import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HistoryList from '../components/HistoryList';
import GeoMap from '../components/GeoMap';

// Backend base URL
// const API_BASE_URL = "http://localhost:8000/api";
const API_BASE_URL = "https://jlabsinternsip.vercel.app";

// Utility function to check IPv4
const isValidIp = (ip) => {
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipv4Regex.test(ip);
};

const HomeScreen = () => {

    const { logout, user } = useAuth();

    const [geoData, setGeoData] = useState(null);
    const [currentUserGeoData, setCurrentUserGeoData] = useState(null);
    const [ipInput, setIpInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);

    // Fetch Geo Data through backend
    const fetchGeoData = useCallback(async (ip = '') => {
        setLoading(true);
        setError('');

        let url = ip
            ? `${API_BASE_URL}/geo/ip/${ip}`
            : `${API_BASE_URL}/geo/self`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.error("Backend Geo API Error:", err);
            setError(err.response?.data?.error || 'Could not fetch geo information.');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch for current user's geolocation
    useEffect(() => {
        fetchGeoData().then(data => {
            if (data) {
                setGeoData(data);
                setCurrentUserGeoData(data);
            }
        });
    }, [fetchGeoData]);

    // Handle search button click
    const handleSearch = async (ipToSearch) => {
        const ip = ipToSearch.trim();

        if (!isValidIp(ip)) {
            return setError('Invalid IP address format.');
        }

        const data = await fetchGeoData(ip);
        if (data) {
            setGeoData(data);
            setError('');

            if (history[0]?.ip !== ip) {
                const newHistoryItem = {
                    ip: data.ip,
                    time: new Date().toLocaleTimeString(),
                    geo: `${data.city}, ${data.country}`
                };
                setHistory(prev => [newHistoryItem, ...prev.filter(item => item.ip !== data.ip)]);
            }
        }
        setIpInput('');
    };

    // Clear search
    const handleClearSearch = () => {
        if (currentUserGeoData) {
            setGeoData(currentUserGeoData);
            setError('');
            setIpInput('');
        }
    };

    // Click a history item to re-search
    const handleHistoryClick = (ip) => {
        handleSearch(ip);
    };

    return (
        <div style={styles.container}>

            <div style={styles.header}>
                <h1>Welcome, {user ? user.email : 'User'}!</h1>
                <button onClick={logout} style={styles.logoutButton}>Logout</button>
            </div>

            <hr />

            <div style={styles.searchSection}>
                <h3>Search by IP Address</h3>
                <input
                    type="text"
                    placeholder="Enter new IP address (e.g., 8.8.8.8)"
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    style={styles.searchInput}
                    disabled={loading}
                />
                <button 
                    onClick={() => handleSearch(ipInput)}
                    disabled={loading || !ipInput}
                    style={styles.searchButton}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>

                <button 
                    onClick={handleClearSearch}
                    disabled={loading || !currentUserGeoData}
                    style={styles.clearButton}
                >
                    Clear
                </button>
            </div>

            {error && <p style={styles.error}>Error: {error}</p>}

            <div style={styles.geoDisplay}>
                <h3>
                    {geoData?.ip === currentUserGeoData?.ip 
                        ? "Your Current Geolocation"
                        : "Search Result"}
                </h3>

                {geoData ? (
                    <div style={styles.dataGrid}>
                        <p><strong>IP Address:</strong> {geoData.ip}</p>
                        <p><strong>City:</strong> {geoData.city}</p>
                        <p><strong>Region:</strong> {geoData.region}</p>
                        <p><strong>Country:</strong> {geoData.country}</p>
                        <p><strong>Location (Lat/Long):</strong> {geoData.loc}</p>
                        <p><strong>Org:</strong> {geoData.org || 'N/A'}</p>
                    </div>
                ) : (
                    <p>{loading ? 'Loading...' : 'No location data available.'}</p>
                )}
            </div>

       <hr />
            {geoData?.loc && ( 
                 <div style={styles.mapSection}>
                     <h3>Exact Location Pin</h3>
                     <GeoMap 
                         loc={geoData.loc} // Passes coordinates
                         ip={geoData.ip} 
                         city={geoData.city} 
                         country={geoData.country} 
                     />
                 </div>
            )}
            <hr /> 
            <HistoryList history={history} onHistoryClick={handleHistoryClick} setHistory={setHistory} />
            
        </div>
    );
};

const styles = {
    container: { maxWidth: '900px', margin: '50px auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoutButton: { padding: '8px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    searchSection: { margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' },
    searchInput: { padding: '10px', width: '300px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' },
    searchButton: { padding: '10px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
    clearButton: { padding: '10px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginTop: '10px' },
    geoDisplay: { margin: '20px 0', padding: '15px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff' },
    dataGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }
};

export default HomeScreen;

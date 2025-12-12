// src/components/GeoMap.js

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// IMPORTANT: Fix for default Leaflet marker icons not displaying correctly in React
// This ensures the marker images are loaded correctly by webpack/CRA
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const GeoMap = ({ loc, ip, city, country }) => {
    // 1. Convert the "lat,long" string (e.g., "14.5995,120.9842") into a numeric array [lat, long]
    const position = useMemo(() => {
        if (!loc) return [0, 0];
        const parts = loc.split(',');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        
        if (isNaN(lat) || isNaN(lng)) {
             return [0, 0]; // Default fallback position
        }
        return [lat, lng];
    }, [loc]);

    // Simple check to ensure coordinates are valid before rendering
    if (position[0] === 0 && position[1] === 0 && loc) {
        return <p style={{ textAlign: 'center', color: '#666' }}>Coordinates unavailable for map display.</p>;
    }

    return (
        <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer 
                center={position} // Centers the map on the coordinates
                zoom={10} // Zoom level 10 is good for regional viewing
                style={{ height: '100%', width: '100%' }}
                // The 'key' forces the map component to re-render/re-center when the location (loc) changes
                key={loc} 
                scrollWheelZoom={true} 
            >
                {/* TileLayer provides the actual map base images (OpenStreetMap) */}
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Marker pins the exact location */}
                <Marker position={position}>
                    <Popup>
                        **{ip}**<br />
                        {city}, {country}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};


export default GeoMap;
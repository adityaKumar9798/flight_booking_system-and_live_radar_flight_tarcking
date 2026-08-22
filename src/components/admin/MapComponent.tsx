'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapOverlayPanel from './MapOverlayPanel';

// Utility to create a rotatable SVG icon for Leaflet
const createAirplaneIcon = (heading: number, color: string) => {
  const svg = `
    <svg viewBox="0 0 24 24" fill="${color}" width="24" height="24" style="transform: rotate(${heading + 45}deg); filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));">
      <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-airplane-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export default function MapComponent({ flights = [] }: { flights?: any[] }) {
  const [movingFlights, setMovingFlights] = useState<any[]>([]);
  const possibleCounts = [10, 15, 20, 50, 60, 100, 200];
  const [mockCount, setMockCount] = useState(15);

  const handleRefresh = () => {
    const randomCount = possibleCounts[Math.floor(Math.random() * possibleCounts.length)];
    setMockCount(randomCount);
  };

  // Generate flights, combining DB flights with mock flights up to mockCount
  const generateFlights = () => {
    const baseFlights = [...flights];
    const needed = Math.max(0, mockCount - baseFlights.length);
    for(let i = 0; i < needed; i++) {
      baseFlights.push({
        id: `mock-${i}`,
        flightNo: `AS${Math.floor(Math.random() * 900) + 100}`,
        airline: 'AeroSky',
        status: Math.random() > 0.9 ? 'Delayed' : 'In Air'
      });
    }
    return baseFlights;
  };

  // Initialize flights with random lat/lng around India/South Asia
  useEffect(() => {
    const allFlights = generateFlights();
    const initialized = allFlights.map(f => {
      const lat = 10 + Math.random() * 20; // 10 to 30
      const lng = 70 + Math.random() * 20; // 70 to 90
      const heading = Math.random() * 360; // 0 to 360 degrees
      // Speed in terms of degrees per tick (very slow)
      const speed = 0.005 + Math.random() * 0.01; 
      
      return {
        ...f,
        lat,
        lng,
        heading,
        speed
      };
    });
    setMovingFlights(initialized);
  }, [flights, mockCount]);

  // Animation loop to move flights slowly in their heading direction
  useEffect(() => {
    const interval = setInterval(() => {
      setMovingFlights(current => current.map(f => {
        // Convert heading to radians for math
        const headingRad = f.heading * (Math.PI / 180);
        // Move slightly in the heading direction
        const dLat = Math.cos(headingRad) * f.speed;
        const dLng = Math.sin(headingRad) * f.speed;

        return {
          ...f,
          lat: f.lat + dLat,
          lng: f.lng + dLng,
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer center={[22, 80]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {movingFlights.map((flight, i) => {
          const color = flight.status === 'Delayed' ? '#ef4444' : '#fbbf24'; // Yellow for active, red for delayed
          
          return (
            <Marker 
              key={flight.id || i} 
              position={[flight.lat, flight.lng]} 
              icon={createAirplaneIcon(flight.heading, color)}
            >
              <Popup>
                <strong>{flight.flightNo}</strong> ({flight.airline})<br />
                Status: {flight.status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      <MapOverlayPanel />
      
      <button 
        onClick={handleRefresh}
        style={{
          position: 'absolute', bottom: '16px', left: '16px', zIndex: 1000,
          background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', 
          color: '#38bdf8', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
        }}
      >
        Refresh Map ({movingFlights.length} Flights)
      </button>

      <style>{`
        .custom-airplane-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

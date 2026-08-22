'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

// Custom aircraft icon
const planeIcon = new L.DivIcon({
  html: `<div style="background-color: #e53e3e; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" /></svg></div>`,
  className: 'custom-plane-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to recenter map smoothly
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

interface MapProps {
  currentPos: [number, number];
  routeLine: [number, number][];
}

export default function FlightMap({ currentPos, routeLine }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{width: '100%', height: '100%', background: '#e2e8f0'}} />;

  return (
    <MapContainer 
      center={currentPos} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      
      {routeLine.length > 0 && (
        <Polyline 
          positions={routeLine} 
          color="#00205c" 
          weight={3} 
          dashArray="10, 10" 
          opacity={0.5} 
        />
      )}
      
      <Marker position={currentPos} icon={planeIcon} />
      <MapUpdater center={currentPos} />
    </MapContainer>
  );
}

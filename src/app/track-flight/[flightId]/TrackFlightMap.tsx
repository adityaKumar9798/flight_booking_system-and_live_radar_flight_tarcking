'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './TrackFlight.module.css';

const createAirplaneIcon = (heading: number, color: string) => {
  const svg = `
    <svg viewBox="0 0 24 24" fill="${color}" width="40" height="40" style="transform: rotate(${heading}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); transform-origin: center;">
      <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-airplane-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function TrackFlightMap({ position, flight, onMarkerClick, showPath }: { position: any, flight: any, onMarkerClick?: () => void, showPath?: boolean }) {
  
  // Memoize the icon so it's not recreated every 100ms, which breaks the click event
  const airplaneIcon = React.useMemo(() => {
    return createAirplaneIcon(position.heading, '#fbbf24');
  }, [Math.round(position.heading)]);

  return (
    <div style={{ height: 'calc(100vh - 120px)', minHeight: '600px', width: '100%' }}>
      <MapContainer center={[position.lat, position.lng]} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker 
          position={[position.lat, position.lng]} 
          icon={airplaneIcon}
          eventHandlers={{
            click: () => {
              if (onMarkerClick) onMarkerClick();
            }
          }}
        >
        </Marker>
      </MapContainer>
      <style>{`
        .custom-airplane-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import styles from './RadarComponent.module.css';

export default function RadarComponent({ flights = [], onRefresh }: { flights?: any[], onRefresh?: () => void }) {
  const [movingFlights, setMovingFlights] = useState<any[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const possibleCounts = [10, 15, 20, 50, 60, 100, 200];
  const [mockCount, setMockCount] = useState(15);

  const handleRefresh = () => {
    const randomCount = possibleCounts[Math.floor(Math.random() * possibleCounts.length)];
    setMockCount(randomCount);
    if (onRefresh) onRefresh();
  };

  // Generate flights, combining DB flights with mock flights up to mockCount
  const generateFlights = () => {
    const baseFlights = [...flights];
    const needed = Math.max(0, mockCount - baseFlights.length);
    for(let i=0; i<needed; i++) {
      baseFlights.push({
        id: `mock-${i}`,
        flightNo: `AS${Math.floor(Math.random() * 900) + 100}`,
        airline: 'AeroSky',
        status: Math.random() > 0.8 ? 'Delayed' : 'In Air'
      });
    }
    return baseFlights;
  };

  // Initialize flights with random x/y positions
  useEffect(() => {
    const allFlights = generateFlights();
    const initialized = allFlights.map(f => {
      const x = Math.random() * 90 + 5; 
      const y = Math.random() * 90 + 5;
      return {
        ...f,
        x,
        y,
        targetX: Math.random() * 90 + 5,
        targetY: Math.random() * 90 + 5
      };
    });
    setMovingFlights(initialized);
  }, [flights, mockCount]);

  // Animation loop to move flights slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setMovingFlights(current => current.map(f => {
        // Move slightly towards target
        const dx = f.targetX - f.x;
        const dy = f.targetY - f.y;
        
        // If we are close to the target, pick a new random point across the map
        let newTargetX = f.targetX;
        let newTargetY = f.targetY;
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
          newTargetX = Math.random() * 90 + 5;
          newTargetY = Math.random() * 90 + 5;
        }

        // Interpolate position by 5% per tick
        return {
          ...f,
          x: f.x + dx * 0.05,
          y: f.y + dy * 0.05,
          targetX: newTargetX,
          targetY: newTargetY
        };
      }));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.radarContainer} ref={containerRef}>
      <div className={styles.radar}>
        {/* Full width grid lines */}
        <div className={styles.gridOverlay} />
        
        <div className={styles.crosshairX} />
        <div className={styles.crosshairY} />
        <div className={styles.sweep} />
        
        {movingFlights.map((flight, i) => {
          // Calculate rotation based on movement direction
          const dx = flight.targetX - flight.x;
          const dy = flight.targetY - flight.y;
          const angleDeg = Math.atan2(dy, dx) * (180 / Math.PI) + 45; // +45 to adjust for SVG icon orientation
          
          return (
            <div 
              key={i} 
              className={`${styles.flight} ${flight.status === 'Delayed' ? styles.flightDelayed : ''}`}
              style={{ left: `${flight.x}%`, top: `${flight.y}%` }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{ transform: `rotate(${angleDeg}deg)`, transition: 'transform 1s linear' }}>
                <path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
              </svg>
              <div className={styles.flightInfo}>
                <strong>{flight.flightNo}</strong><br/>
                {flight.airline}
              </div>
            </div>
          );
        })}
      </div>
      
      {onRefresh && (
        <button 
          onClick={handleRefresh}
          style={{
            position: 'absolute', top: '16px', right: '16px', 
            background: 'rgba(15,23,42,0.8)', border: '1px solid #334155', 
            color: '#38bdf8', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Refresh Radar ({movingFlights.length} Flights)
        </button>
      )}
    </div>
  );
}

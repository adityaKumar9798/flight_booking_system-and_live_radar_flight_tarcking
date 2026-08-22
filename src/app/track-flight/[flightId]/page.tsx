'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './TrackFlight.module.css';

const TrackFlightMap = dynamic(() => import('./TrackFlightMap'), { ssr: false });

export default function TrackFlightPage() {
  const params = useParams();
  const router = useRouter();
  const flightId = params.flightId as string;

  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [position, setPosition] = useState<any>({ lat: 0, lng: 0, heading: 90 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const res = await fetch(`/api/flight-status?flight=${flightId}`);
        if (!res.ok) {
          throw new Error('Flight not found or tracking not available.');
        }
        const data = await res.json();
        setFlight(data);
        
        const depLat = data.departure?.lat || (20 + Math.random() * 30);
        const depLng = data.departure?.lng || (30 + Math.random() * 60);
        const arrLat = data.arrival?.lat || (depLat + 10);
        const arrLng = data.arrival?.lng || (depLng + 10);
        
        // Calculate visual heading for Web Mercator projection so the icon aligns perfectly
        const toRad = Math.PI / 180;
        const y1 = Math.log(Math.tan(Math.PI / 4 + (depLat * toRad) / 2));
        const y2 = Math.log(Math.tan(Math.PI / 4 + (arrLat * toRad) / 2));
        const dy = y2 - y1;
        const dx = (arrLng - depLng) * toRad;
        const heading = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

        // Place plane somewhere along the route (e.g. 30% into the flight)
        const deltaLat = arrLat - depLat;
        const deltaLng = arrLng - depLng;
        const currentLat = depLat + deltaLat * 0.3;
        const currentLng = depLng + deltaLng * 0.3;

        setPosition({ 
          lat: currentLat, 
          lng: currentLng, 
          heading, 
          depLat, 
          depLng, 
          arrLat, 
          arrLng,
          altitude: 32500,
          speed: 465
        });
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (flightId) {
      fetchFlightDetails();
    }
  }, [flightId]);

  // Animation Loop
  useEffect(() => {
    if (!flight || loading) return;

    const interval = setInterval(() => {
      setPosition((prev: any) => {
        const speed = 0.001; // much slower speed (degrees per tick)
        const headingRad = prev.heading * (Math.PI / 180);
        const dLat = Math.cos(headingRad) * speed;
        const dLng = Math.sin(headingRad) * speed;

        return {
          ...prev,
          lat: prev.lat + dLat,
          lng: prev.lng + dLng,
          altitude: prev.altitude + (Math.random() * 4 - 2), // changes by +/- 2 ft
          speed: prev.speed + (Math.random() * 0.4 - 0.2) // changes by +/- 0.2 kts
        };
      });
    }, 100); // 10 ticks per second for smooth animation

    return () => clearInterval(interval);
  }, [flight, loading]);

  if (loading) {
    return <div style={{padding: '100px', textAlign: 'center'}}>Loading radar...</div>;
  }

  if (error) {
    return (
      <div style={{padding: '100px', textAlign: 'center'}}>
        <h2>Oops!</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/flight-status')} style={{padding: '10px 20px', marginTop: '20px', cursor: 'pointer'}}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.mapWrapper}>
        <div className={styles.infoOverlay}>
          <h2>{flight.airline} {flight.flightNumber}</h2>
          <div className={styles.routeBox}>
            <div>
              <h3>{flight.departure.airport}</h3>
              <p>Dep: {flight.departure.time}</p>
            </div>
            <div className={styles.arrow}>→</div>
            <div>
              <h3>{flight.arrival.airport}</h3>
              <p>Arr: {flight.arrival.time}</p>
            </div>
          </div>
          <div className={styles.statusBox}>
            <span style={{color: flight.isDelayed ? '#ef4444' : '#10b981', fontWeight: 'bold'}}>{flight.status}</span>
            <p>Aircraft: {flight.aircraft}</p>
          </div>
        </div>

        <TrackFlightMap position={position} flight={flight} onMarkerClick={() => setIsPanelOpen(true)} />
        
        {/* Slide-in Panel */}
        <div className={`${styles.sidePanel} ${isPanelOpen ? styles.sidePanelOpen : ''}`}>
          <button className={styles.closeButton} onClick={() => setIsPanelOpen(false)}>
            &times;
          </button>
          
          <div className={styles.imageContainer}>
            <img 
              src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop" 
              alt="Airplane" 
              className={styles.planePhoto} 
            />
            <div className={styles.imageOverlay}></div>
          </div>
          
          <div className={styles.panelContent}>
            <h3 className={styles.panelTitle}>{flight.airline} {flight.flightNumber}</h3>
            <p className={styles.panelSubtitle}>
              {flight.departure.airport} 
              <span style={{ color: '#475569' }}>&rarr;</span> 
              {flight.arrival.airport}
            </p>

            <div className={styles.panelSection}>
              <h4>Live Telemetry</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <h5>Altitude</h5>
                  <p>{Math.floor(position.altitude || 32000)} ft</p>
                </div>
                <div className={styles.detailItem}>
                  <h5>Ground Speed</h5>
                  <p>{Math.floor(position.speed || 460)} kts</p>
                </div>
                <div className={styles.detailItem}>
                  <h5>Heading</h5>
                  <p>{Math.round(position.heading)}&deg;</p>
                </div>
                <div className={styles.detailItem}>
                  <h5>Coordinates</h5>
                  <p>{position.lat.toFixed(2)}, {position.lng.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className={styles.panelSection}>
              <h4>Flight Info</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <h5>Aircraft</h5>
                  <p>{flight.aircraft}</p>
                </div>
                <div className={styles.detailItem}>
                  <h5>Status</h5>
                  <p style={{color: flight.isDelayed ? '#ef4444' : '#10b981'}}>{flight.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

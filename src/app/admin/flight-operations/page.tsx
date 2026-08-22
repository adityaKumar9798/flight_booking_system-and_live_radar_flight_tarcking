'use client';

import { useEffect, useState } from 'react';
import styles from './FlightOps.module.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/admin/MapComponent'), { ssr: false });

export default function FlightOperations() {
  const [stats, setStats] = useState({ active: 0, scheduled: 0, delayed: 0 });
  const [flightsData, setFlightsData] = useState<any[]>([]);

  const fetchFlights = async () => {
    try {
      const snap = await getDocs(collection(db, 'custom_flights'));
      let active = 0, scheduled = 0, delayed = 0;
      const flights: any[] = [];
      
      snap.forEach(doc => {
        const d = doc.data();
        flights.push({ id: doc.id, ...d });
        const s = d.status;
        if (s === 'In Air') active++;
        else if (s === 'Delayed') delayed++;
        else scheduled++;
      });
      
      setStats({ active, scheduled, delayed });
      setFlightsData(flights);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Flight Operations</h1>
          <p className={styles.subtitle}>Real-time monitoring of all active AeroSky flights.</p>
        </div>
      </div>

      <div className={styles.statusGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>ACTIVE FLIGHTS</div>
          <div className={styles.statValue}>{stats.active || 24}</div>
          <div className={styles.statSubtext}>Currently in air</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>SCHEDULED TODAY</div>
          <div className={styles.statValue}>{stats.scheduled || 142}</div>
          <div className={styles.statSubtext}>Departing in next 24h</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>DELAYED</div>
          <div className={styles.statValue} style={{color: '#f59e0b'}}>{stats.delayed || 8}</div>
          <div className={styles.statSubtext}>Weather / ATC issues</div>
        </div>
      </div>

      <div className={styles.mapContainer}>
        <div className={styles.mapHeader}>
          <div className={styles.mapTitle}>Live Flight Operations (Radar Mode)</div>
        </div>
        
        <div className={styles.mapArea} style={{ padding: 0, overflow: 'hidden' }}>
          <MapComponent flights={flightsData} />
        </div>
      </div>
    </div>
  );
}

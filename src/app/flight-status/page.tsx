'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './FlightStatus.module.css';

export default function FlightStatusPage() {
  const [flightNumber, setFlightNumber] = useState('');
  const [date, setDate] = useState('Today');
  const [loading, setLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatusResult(null);

    if (!flightNumber) {
      setError('Please enter a valid Flight Number.');
      return;
    }

    setLoading(true);

    const fetchFlight = async () => {
      try {
        const res = await fetch(`/api/flight-status?flight=${flightNumber}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch flight status');
        }
        
        const data = await res.json();
        setStatusResult(data);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching the flight status.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  };

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.title}>Flight Status</h1>
          <p className={styles.subtitle}>Check real-time flight status, delays, and gate information.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.contentWrapper}>
          <div className={styles.searchPanel}>
            <form onSubmit={handleSearch} className={styles.form}>
              <div className={styles.inputGroup}>
                <label>Flight Number</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type="text" 
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. AS102"
                  />
                  <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Date</label>
                <select value={date} onChange={(e) => setDate(e.target.value)}>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Searching...' : 'Check Status'}
              </button>
            </form>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          {statusResult && (
            <div className={styles.resultCard}>
              <div className={styles.cardImageHeader}>
                <div className={styles.cardImageOverlay}>
                  <div className={styles.resultHeader}>
                    <div>
                      <h2 className={styles.flightNum}>{statusResult.airline} {statusResult.flightNumber}</h2>
                      <span className={`${styles.statusBadge} ${statusResult.isDelayed ? styles.statusDelayed : styles.statusOnTime}`}>
                        {statusResult.status}
                      </span>
                    </div>
                    <div className={styles.aircraftInfo}>Aircraft: {statusResult.aircraft}</div>
                  </div>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.timeline}>
                <div className={styles.timelinePoint}>
                  <div className={styles.timeLabel}>DEPARTURE</div>
                  <div className={styles.timeVal}>{statusResult.departure.time}</div>
                  <div className={styles.dateVal}>{statusResult.departure.date}</div>
                  <div className={styles.airportName}>{statusResult.departure.airport}</div>
                  <div className={styles.gateInfo}>Terminal {statusResult.departure.terminal} • Gate {statusResult.departure.gate}</div>
                </div>

                <div className={styles.timelinePath}>
                  <div className={styles.flightDuration}>{statusResult.duration}</div>
                  <div className={styles.line}></div>
                  <svg className={styles.planeIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" /></svg>
                </div>

                <div className={styles.timelinePoint}>
                  <div className={styles.timeLabel}>ARRIVAL</div>
                  <div className={styles.timeVal}>{statusResult.arrival.time}</div>
                  <div className={styles.dateVal}>{statusResult.arrival.date}</div>
                  <div className={styles.airportName}>{statusResult.arrival.airport}</div>
                  <div className={styles.gateInfo}>Terminal {statusResult.arrival.terminal} • Gate {statusResult.arrival.gate}</div>
                </div>
                </div>
              </div>
              
              <div className={styles.actionFooter}>
                <button 
                  className={styles.trackBtn}
                  onClick={() => window.location.href = `/track-flight/${statusResult.flightNumber}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px', verticalAlign: 'middle'}}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  Live Map Tracking
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

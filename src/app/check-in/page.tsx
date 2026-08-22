'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './CheckIn.module.css';

export default function CheckInPage() {
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!pnr || !lastName) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (pnr.length >= 5) {
        setSuccess(true);
      } else {
        setError('Invalid Booking Reference. Please check and try again.');
      }
    }, 1500);
  };

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.title}>Web Check-in</h1>
          <p className={styles.subtitle}>Save time at the airport. Check in online up to 24 hours before your flight.</p>
        </div>
      </div>

      <div className="container">
        <div className={styles.formContainer}>
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h2>Check-in Complete!</h2>
              <p>Booking Reference: <strong>{pnr.toUpperCase()}</strong></p>
              <p>Your boarding pass has been sent to your registered email address.</p>
              <button className={styles.downloadBtn} onClick={() => window.print()}>
                Download Boarding Pass
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleCheckIn}>
              <div className={styles.inputGroup}>
                <label>Booking Reference (PNR) / Ticket Number</label>
                <input 
                  type="text" 
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value.toUpperCase())}
                  placeholder="e.g. A3F8K9"
                  maxLength={13}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                />
              </div>

              {error && <div className={styles.errorAlert}>{error}</div>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Searching...' : 'Find Booking'}
              </button>
            </form>
          )}

          <div className={styles.infoSection}>
            <h3>Important Information</h3>
            <ul className={styles.infoList}>
              <li>Web check-in is available 48 hours to 1 hour before scheduled departure.</li>
              <li>You can select your preferred seat and purchase extra baggage during check-in.</li>
              <li>Please carry a printed or digital copy of your boarding pass to the airport.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

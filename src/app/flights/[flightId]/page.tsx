'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBooking, Flight } from '@/lib/booking-context';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import styles from './FlightDetails.module.css';

export default function FlightDetails() {
  const params = useParams();
  const router = useRouter();
  const { state } = useBooking();
  const [flight, setFlight] = useState<Flight | null>(null);

  useEffect(() => {
    // Usually we would fetch the specific flight by ID from the backend if it's not in state.
    // Since this is a demo without a real db of flights, we just use the selected flight from Context.
    if (state.selectedFlight && state.selectedFlight.id === params.flightId) {
      setFlight(state.selectedFlight);
    } else {
      // If we landed here directly or refreshed, redirect back to search
      router.push('/');
    }
  }, [params.flightId, state.selectedFlight, router]);

  if (!flight) {
    return (
      <main className={styles.main}>
        <Header />
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h2>Loading flight details...</h2>
        </div>
        <Footer />
      </main>
    );
  }

  const departureDate = new Date(flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'long', day: 'numeric' });
  const depTime = new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrTime = new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.headerBanner}>
        <div className="container">
          <h1>Flight Details</h1>
          <p>Review your itinerary and fare details before proceeding to booking.</p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Itinerary</h3>
              <span className={styles.date}>{departureDate}</span>
            </div>
            
            <div className={styles.itineraryBody}>
              <div className={styles.airlineHeader}>
                <div className={styles.logo}>{(flight.airline || '??').substring(0, 2).toUpperCase()}</div>
                <div>
                  <strong>{flight.airline || 'Unknown Airline'}</strong>
                  <div className={styles.flightMeta}>Flight {flight.flightNumber} • {flight.aircraft} • {state.search?.travelClass || 'Economy'}</div>
                </div>
              </div>

              <div className={styles.timeline}>
                <div className={styles.timelineNode}>
                  <div className={styles.time}>{depTime}</div>
                  <div className={styles.dot}></div>
                  <div className={styles.airport}>
                    <strong>{flight.departureAirport}</strong>
                    <p>Terminal 1</p>
                  </div>
                </div>
                
                <div className={styles.timelineSegment}>
                  <div className={styles.line}></div>
                  <div className={styles.durationInfo}>
                    <span>{flight.duration}</span>
                  </div>
                </div>

                <div className={styles.timelineNode}>
                  <div className={styles.time}>{arrTime}</div>
                  <div className={styles.dot}></div>
                  <div className={styles.airport}>
                    <strong>{flight.arrivalAirport}</strong>
                    <p>Terminal 3</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Baggage Information</h3>
            </div>
            <div className={styles.cardBody}>
              <ul className={styles.baggageList}>
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-3V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 5h6v2H9V5zm11 14H4V9h16v10z"/></svg>
                  <span>Cabin Baggage: 1 piece (up to 8kg) included</span>
                </li>
                <li>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z"/></svg>
                  <span>Checked Baggage: 1 piece (up to 23kg) included</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <div className={styles.summaryCard}>
            <h3>Fare Summary</h3>
            <div className={styles.fareBreakdown}>
              <div className={styles.fareRow}>
                <span>Base Fare (x{state.search?.adults || 1})</span>
                <span>{state.currencySymbol}{Math.round(flight.price * state.exchangeRate)}</span>
              </div>
              <div className={styles.fareRow}>
                <span>Taxes & Fees</span>
                <span>{state.currencySymbol}{Math.round(45 * state.exchangeRate)}</span>
              </div>
              <div className={styles.fareDivider}></div>
              <div className={`${styles.fareRow} ${styles.totalRow}`}>
                <span>Total Amount</span>
                <span>{state.currencySymbol}{Math.round((flight.price + 45) * state.exchangeRate)}</span>
              </div>
            </div>

            <button 
              className={styles.continueBtn}
              onClick={() => router.push('/booking/passengers')}
            >
              Continue to Booking
            </button>
            
            <p className={styles.policyText}>
              By continuing, you agree to our Terms of Service and Cancellation Policy.
            </p>
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  );
}

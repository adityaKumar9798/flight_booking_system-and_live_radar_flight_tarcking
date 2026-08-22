'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './MyTrips.module.css';

export default function MyTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        try {
          const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const firestoreTrips: any[] = [];
          querySnapshot.forEach((docSnap) => {
            firestoreTrips.push(docSnap.data());
          });
          
          firestoreTrips.sort((a, b) => new Date(b.dateBooked).getTime() - new Date(a.dateBooked).getTime());
          setTrips(firestoreTrips);
        } catch (err) {
          console.error("Error fetching trips from Firestore:", err);
          fallbackToLocal();
        }
      } else {
        fallbackToLocal();
      }
      setLoading(false);
    });

    const fallbackToLocal = () => {
      const savedTrips = localStorage.getItem('aerosky_my_trips');
      if (savedTrips) {
        try {
          setTrips(JSON.parse(savedTrips));
        } catch (e) {
          console.error("Failed to parse trips", e);
        }
      }
    };

    return () => unsubscribe();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? Cancellation fees may apply.')) {
      const updatedTrips = trips.map(trip => {
        if (trip.bookingId === bookingId) {
          return { ...trip, status: 'Cancelled' };
        }
        return trip;
      });
      
      setTrips(updatedTrips);
      
      if (auth.currentUser) {
        try {
          await updateDoc(doc(db, 'bookings', bookingId), {
            status: 'Cancelled'
          });
        } catch (err) {
          console.error("Error updating booking in Firestore", err);
        }
      }
      
      localStorage.setItem('aerosky_my_trips', JSON.stringify(updatedTrips));
    }
  };

  const now = new Date();

  // Filter trips
  const upcomingTrips = trips.filter(t => t.status !== 'Cancelled' && new Date(t.flight.departureTime) >= now);
  const completedTrips = trips.filter(t => t.status !== 'Cancelled' && new Date(t.flight.departureTime) < now);
  const cancelledTrips = trips.filter(t => t.status === 'Cancelled');

  const getActiveTrips = () => {
    let list = [];
    if (activeTab === 'upcoming') list = upcomingTrips;
    else if (activeTab === 'completed') list = completedTrips;
    else list = cancelledTrips;

    // Deduplicate visually to hide any strict-mode double bookings
    const seen = new Set();
    return list.filter(trip => {
      // Use flight number and total paid as a unique signature for the booking intent
      const sig = `${trip.flight.flightNumber}-${trip.totalPaid}`;
      if (seen.has(sig)) return false;
      seen.add(sig);
      return true;
    });
  };

  const displayedTrips = getActiveTrips();

  return (
    <main className={styles.main}>
      <Header />
      
      <div className={styles.headerBanner}>
        <div className="container">
          <h1>My Trips</h1>
          <p>Manage your upcoming flights and view past bookings.</p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingTrips.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'completed' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedTrips.length})
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'cancelled' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({cancelledTrips.length})
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading your trips...</div>
        ) : (
          <div className={styles.tripList}>
            {displayedTrips.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <h3>No {activeTab} trips found</h3>
                <p>You don't have any {activeTab} bookings at the moment.</p>
                {activeTab === 'upcoming' && (
                  <button className={styles.bookBtn} onClick={() => window.location.href = '/'}>
                    Book a Flight
                  </button>
                )}
              </div>
            ) : (
              displayedTrips.map((trip) => (
                <div key={trip.bookingId} className={styles.tripCard}>
                  <div className={styles.tripHeader}>
                    <div className={styles.tripStatus}>
                      <span className={`${styles.statusDot} ${styles[`status${trip.status}`]}`}></span>
                      {trip.status}
                    </div>
                    <div className={styles.tripRef}>
                      PNR: <strong>{trip.pnr}</strong> | Booking ID: {trip.bookingId}
                    </div>
                  </div>
                  
                  <div className={styles.tripBody}>
                    <div className={styles.routeInfo}>
                      <div className={styles.date}>
                        {new Date(trip.flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className={styles.airports}>
                        <div className={styles.airportBlock}>
                          <span className={styles.time}>{new Date(trip.flight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className={styles.code}>{trip.flight.departureAirport}</span>
                        </div>
                        
                        <div className={styles.flightLine}>
                          <span className={styles.airline}>{trip.flight.airline} {trip.flight.flightNumber}</span>
                          <div className={styles.line}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </div>
                        </div>
                        
                        <div className={styles.airportBlock}>
                          <span className={styles.time}>{new Date(trip.flight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className={styles.code}>{trip.flight.arrivalAirport}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.passengersInfo}>
                      <p><strong>{trip.passengers.length} Passenger(s)</strong></p>
                      <p className={styles.passengerNames}>
                        {trip.passengers.map((p: any) => `${p.firstName} ${p.lastName}`).join(', ')}
                      </p>
                      <p className={styles.totalPaid}>Total: {trip.currencySymbol || '₹'}{Math.round(trip.totalPaid * (trip.exchangeRate || 83.5)).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className={styles.tripFooter}>
                    <button className={styles.viewDetailsBtn}>View Details</button>
                    {activeTab === 'upcoming' && (
                      <>
                        <button 
                          className={styles.trackBtn}
                          onClick={() => window.location.href = `/track-flight/${trip.flight.flightNumber.replace(/\s+/g, '')}`}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', verticalAlign: 'middle'}}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                          Track Flight
                        </button>
                        <button 
                          className={styles.cancelBtn}
                          onClick={() => handleCancelBooking(trip.bookingId)}
                        >
                          Cancel Booking
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

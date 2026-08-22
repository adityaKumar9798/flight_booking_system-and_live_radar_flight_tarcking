'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/booking-context';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import styles from './Confirmation.module.css';

export default function ConfirmationPage() {
  const router = useRouter();
  const { state, clearBooking } = useBooking();
  const [bookingRef, setBookingRef] = useState('');
  const [pnr, setPnr] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const isSaving = useRef(false);

  useEffect(() => {
    if (!state.selectedFlight && !hasSaved && !isSaving.current) {
      router.push('/');
      return;
    }

    if (state.selectedFlight && !hasSaved && !isSaving.current) {
      isSaving.current = true;
      // Generate IDs
      const generateId = (length: number, alphanumeric = true) => {
        const chars = alphanumeric ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };

      const newBookingId = `ANX-2026-${generateId(5)}`;
      const newPnr = generateId(6);

      setBookingRef(newBookingId);
      setPnr(newPnr);

      const saveBooking = async () => {
        const existingTripsStr = localStorage.getItem('aerosky_my_trips');
        const existingTrips = existingTripsStr ? JSON.parse(existingTripsStr) : [];
        
        const newTrip = {
          bookingId: newBookingId,
          pnr: newPnr,
          dateBooked: new Date().toISOString(),
          status: 'Confirmed',
          flight: state.selectedFlight,
          passengers: state.passengers,
          seats: state.seats,
          totalPaid: (state.selectedFlight!.price * (state.search?.adults || 1)) + (state.seats.reduce((acc, s) => acc + s.price, 0)) + (45 * (state.search?.adults || 1)) - state.discount,
          currencySymbol: state.currencySymbol,
          exchangeRate: state.exchangeRate,
          userId: auth.currentUser ? auth.currentUser.uid : null
        };

        if (auth.currentUser) {
          try {
            await setDoc(doc(db, 'bookings', newBookingId), newTrip);
            // Optionally still save to local storage for quick access
            localStorage.setItem('aerosky_my_trips', JSON.stringify([newTrip, ...existingTrips]));
          } catch (err) {
            console.error("Error saving booking to Firestore:", err);
            localStorage.setItem('aerosky_my_trips', JSON.stringify([newTrip, ...existingTrips]));
          }
        } else {
          localStorage.setItem('aerosky_my_trips', JSON.stringify([newTrip, ...existingTrips]));
        }

        setHasSaved(true);
        clearBooking();
      };

      saveBooking();
    }
  }, [state, hasSaved, router, clearBooking]);

  if (!hasSaved) return null;

  return (
    <div className={styles.container}>
      <div className={styles.successIcon}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      </div>
      
      <h1 className={styles.title}>Booking Confirmed!</h1>
      <p className={styles.subtitle}>Your e-ticket has been sent to your email address.</p>

      <div className={styles.referenceCards}>
        <div className={styles.refCard}>
          <span className={styles.refLabel}>Booking Reference (PNR)</span>
          <span className={styles.refValue}>{pnr}</span>
        </div>
        <div className={styles.refCard}>
          <span className={styles.refLabel}>Booking ID</span>
          <span className={styles.refValue}>{bookingRef}</span>
        </div>
      </div>

      <div className={styles.infoBox}>
        <div className={styles.infoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        </div>
        <div className={styles.infoText}>
          <strong>Next Steps</strong>
          <p>You can manage your booking, select meals, and add extra baggage in the "My Trips" section. Online check-in opens 48 hours before departure.</p>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.downloadBtn} onClick={() => alert('Downloading e-ticket PDF...')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download E-Ticket
        </button>
        <button className={styles.tripsBtn} onClick={() => router.push('/my-trips')}>
          View My Trips
        </button>
        <button className={styles.homeBtn} onClick={() => router.push('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

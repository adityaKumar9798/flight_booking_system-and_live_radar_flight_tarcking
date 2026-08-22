'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/booking-context';
import styles from './Review.module.css';

export default function ReviewPage() {
  const router = useRouter();
  const { state, applyPromoCode } = useBooking();
  
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!state.selectedFlight) return null;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    
    if (promoInput.toUpperCase() === 'AEROSKY100') {
      applyPromoCode('AEROSKY100', 100);
      setPromoSuccess('Promo code applied successfully!');
    } else if (promoInput.toUpperCase() === 'WELCOME50') {
      applyPromoCode('WELCOME50', 50);
      setPromoSuccess('Promo code applied successfully!');
    } else {
      setPromoError('Invalid promotional code.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Review Your Booking</h1>
      <p className={styles.subtitle}>Please verify your details before proceeding to payment.</p>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Flight Details</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.flightRow}>
            <div className={styles.flightAirline}>
              <div className={styles.logo}>{state.selectedFlight.airline.substring(0,2).toUpperCase()}</div>
              <div>
                <strong>{state.selectedFlight.airline}</strong>
                <p>Flight {state.selectedFlight.flightNumber}</p>
              </div>
            </div>
            
            <div className={styles.flightRoute}>
              <div className={styles.routeNode}>
                <strong>{new Date(state.selectedFlight.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
                <span>{state.selectedFlight.departureAirport}</span>
              </div>
              
              <div className={styles.routePath}>
                <span>{state.selectedFlight.duration}</span>
                <div className={styles.pathLine}></div>
                <span>{state.selectedFlight.stops === 0 ? 'Direct' : `${state.selectedFlight.stops} Stops`}</span>
              </div>
              <div className={styles.routeNode}>
                <strong>{new Date(state.selectedFlight.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
                <span>{state.selectedFlight.arrivalAirport}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Passenger Details</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.passengerList}>
            {state.passengers.map((p, idx) => {
              const seat = state.seats.find(s => s.passengerId === p.id);
              return (
                <div key={p.id} className={styles.passengerItem}>
                  <div className={styles.pInfo}>
                    <span className={styles.pBadge}>{p.type}</span>
                    <strong>{p.firstName} {p.lastName}</strong>
                  </div>
                  <div className={styles.pSeat}>
                    Seat: <strong>{seat ? seat.seatNumber : 'Unassigned'}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Promotional Code</h3>
        </div>
        <div className={styles.cardBody}>
          <div className={styles.promoWrap}>
            <input 
              type="text" 
              placeholder="Enter promo code (e.g. AEROSKY100)" 
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className={styles.promoInput}
            />
            <button onClick={handleApplyPromo} className={styles.promoBtn}>Apply</button>
          </div>
          {promoError && <p className={styles.promoError}>{promoError}</p>}
          {promoSuccess && <p className={styles.promoSuccess}>{promoSuccess}</p>}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => router.back()}>Back</button>
        <button className={styles.continueBtn} onClick={() => router.push('/booking/payment')}>Proceed to Payment</button>
      </div>
    </div>
  );
}

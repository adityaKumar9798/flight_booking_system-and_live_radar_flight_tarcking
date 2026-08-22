'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useBooking } from '@/lib/booking-context';
import styles from './BookingLayout.module.css';

const STEPS = [
  { id: 'passengers', label: 'Passengers', path: '/booking/passengers' },
  { id: 'seats', label: 'Seat Selection', path: '/booking/seats' },
  { id: 'review', label: 'Review', path: '/booking/review' },
  { id: 'payment', label: 'Payment', path: '/booking/payment' },
  { id: 'confirmation', label: 'Confirmation', path: '/booking/confirmation' },
];

export default function BookingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { state } = useBooking();
  
  const currentStepIndex = STEPS.findIndex(s => s.path === pathname);
  
  // If no flight selected, we probably shouldn't be here, but we will handle it gracefully in the children
  const flight = state.selectedFlight;

  // Calculate Base Fare
  const adults = state.search?.adults || 1;
  const baseFare = flight ? flight.price * adults : 0;
  
  // Calculate Seats
  const seatsTotal = state.seats.reduce((acc, seat) => acc + seat.price, 0);
  
  const taxes = flight ? 45 * adults : 0;
  const total = baseFare + seatsTotal + taxes - state.discount;

  return (
    <div className={styles.layout}>
      <Header />
      
      <div className={styles.progressContainer}>
        <div className="container">
          <div className={styles.progressBar}>
            {STEPS.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isPast = index < currentStepIndex;
              
              return (
                <div key={step.id} className={`${styles.step} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''}`}>
                  <div className={styles.stepCircle}>{index + 1}</div>
                  <span className={styles.stepLabel}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`container ${styles.contentWrapper}`}>
        <main className={styles.mainContent}>
          {children}
        </main>
        
        {pathname !== '/booking/confirmation' && (
          <aside className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h3>Booking Summary</h3>
              
              {flight ? (
                <>
                  <div className={styles.flightSummary}>
                    <div className={styles.summaryRoute}>
                      <span>{flight.departureAirport}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      <span>{flight.arrivalAirport}</span>
                    </div>
                    <div className={styles.summaryDate}>
                      {new Date(flight.departureTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                    <div className={styles.priceBreakdown}>
                      <div className={styles.priceRow}>
                        <span>Base Fare ({adults} Passenger)</span>
                        <span>{state.currencySymbol}{Math.round(baseFare * state.exchangeRate)}</span>
                      </div>
                      
                      {seatsTotal > 0 && (
                        <div className={styles.priceRow}>
                          <span>Seat Selection</span>
                          <span>{state.currencySymbol}{Math.round(seatsTotal * state.exchangeRate)}</span>
                        </div>
                      )}
                      
                      <div className={styles.priceRow}>
                        <span>Taxes & Fees</span>
                        <span>{state.currencySymbol}{Math.round(taxes * state.exchangeRate)}</span>
                      </div>
                      
                      {state.discount > 0 && (
                        <div className={`${styles.priceRow} ${styles.discountRow}`}>
                          <span>Discount ({state.promoCode})</span>
                          <span>-{state.currencySymbol}{Math.round(state.discount * state.exchangeRate)}</span>
                        </div>
                      )}
                      
                      <div className={styles.divider}></div>
                      
                      <div className={`${styles.priceRow} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span>{state.currencySymbol}{Math.round(total * state.exchangeRate)}</span>
                      </div>
                    </div>
                </>
              ) : (
                <p>No flight selected.</p>
              )}
            </div>
          </aside>
        )}
      </div>

      <Footer />
    </div>
  );
}

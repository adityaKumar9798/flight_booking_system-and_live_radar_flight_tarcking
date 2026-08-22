'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking, Seat } from '@/lib/booking-context';
import styles from './Seats.module.css';

const ROWS = 15;
const COLS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Generate mock airplane layout
const generateLayout = () => {
  const seats = [];
  for (let r = 1; r <= ROWS; r++) {
    for (const c of COLS) {
      const isPremium = r <= 4;
      const isExtraLegroom = r === 1 || r === 8;
      
      // Randomly occupy some seats
      const isOccupied = Math.random() > 0.7;
      
      let price = 0;
      if (isPremium) price = 45;
      else if (isExtraLegroom) price = 25;
      else if (c === 'A' || c === 'F') price = 15; // Window
      else if (c === 'C' || c === 'D') price = 10; // Aisle
      else price = 5; // Middle

      seats.push({
        id: `${r}${c}`,
        row: r,
        col: c,
        isPremium,
        isExtraLegroom,
        isOccupied,
        price
      });
    }
  }
  return seats;
};

export default function SeatsPage() {
  const router = useRouter();
  const { state, updateSeats } = useBooking();
  const passengers = state.passengers;
  
  const [layout, setLayout] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);

  useEffect(() => {
    if (!state.selectedFlight || passengers.length === 0) {
      router.push('/booking/passengers');
      return;
    }
    
    // Check if seats already exist in state
    if (state.seats.length > 0) {
      setSelectedSeats(state.seats);
    }
    
    setLayout(generateLayout());
  }, [state.selectedFlight, passengers.length, router, state.seats]);

  const handleSeatClick = (seatDef: any) => {
    if (seatDef.isOccupied) return;

    const existingSelectionIndex = selectedSeats.findIndex(s => s.seatNumber === seatDef.id);
    
    if (existingSelectionIndex >= 0) {
      // Deselect
      const newSelection = [...selectedSeats];
      newSelection.splice(existingSelectionIndex, 1);
      setSelectedSeats(newSelection);
    } else {
      // Select for current passenger
      if (selectedSeats.length >= passengers.length) {
        // Already selected for all, let's replace the last one or prompt
        return; // for simplicity, just ignore if max reached
      }
      
      // Find which passenger we are selecting for
      const passengerId = passengers[selectedSeats.length].id;
      
      setSelectedSeats([...selectedSeats, {
        passengerId,
        seatNumber: seatDef.id,
        price: seatDef.price
      }]);
    }
  };

  const handleSubmit = () => {
    // Ideally validate that all passengers have seats
    if (selectedSeats.length !== passengers.length) {
      alert(`Please select seats for all ${passengers.length} passengers.`);
      return;
    }
    
    updateSeats(selectedSeats);
    router.push('/booking/review');
  };

  if (!state.selectedFlight || passengers.length === 0 || layout.length === 0) return null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Seats</h1>
      
      <div className={styles.statusPanel}>
        <div className={styles.passengerTabs}>
          {passengers.map((p, index) => {
            const hasSeat = selectedSeats.find(s => s.passengerId === p.id);
            return (
              <div 
                key={p.id} 
                className={`${styles.tab} ${selectedSeats.length === index ? styles.activeTab : ''} ${hasSeat ? styles.completedTab : ''}`}
              >
                <span>{p.firstName} {p.lastName}</span>
                <strong>{hasSeat ? hasSeat.seatNumber : 'Unassigned'}</strong>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.airplaneLayout}>
        <div className={styles.planeNose}></div>
        
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.seatBox} ${styles.premiumBox}`}></div>
            <span>Premium ({state.currencySymbol}{Math.round(45 * state.exchangeRate)})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.seatBox} ${styles.standardBox}`}></div>
            <span>Standard ({state.currencySymbol}{Math.round(25 * state.exchangeRate)})</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.seatBox} ${styles.selectedBox}`}></div>
            <span>Selected</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.seatBox} ${styles.occupiedBox}`}></div>
            <span>Occupied</span>
          </div>
        </div>

        <div className={styles.cabin}>
          {Array.from({ length: ROWS }).map((_, rowIndex) => {
            const r = rowIndex + 1;
            const rowSeats = layout.filter(s => s.row === r);
            
            return (
              <div key={`row-${r}`} className={styles.row}>
                <div className={styles.rowNumber}>{r}</div>
                
                <div className={styles.seatGroup}>
                  {rowSeats.slice(0, 3).map(seat => (
                    <SeatButton 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={!!selectedSeats.find(s => s.seatNumber === seat.id)}
                      onClick={() => handleSeatClick(seat)}
                    />
                  ))}
                </div>
                
                <div className={styles.aisle}></div>
                
                <div className={styles.seatGroup}>
                  {rowSeats.slice(3, 6).map(seat => (
                    <SeatButton 
                      key={seat.id} 
                      seat={seat} 
                      isSelected={!!selectedSeats.find(s => s.seatNumber === seat.id)}
                      onClick={() => handleSeatClick(seat)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className={styles.planeTail}></div>
      </div>

      <div className={styles.actions}>
        <button className={styles.backBtn} onClick={() => router.back()}>Back</button>
        <button 
          className={styles.continueBtn} 
          onClick={handleSubmit}
          disabled={selectedSeats.length !== passengers.length}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}

function SeatButton({ seat, isSelected, onClick }: { seat: any, isSelected: boolean, onClick: () => void }) {
  const { state } = useBooking();
  let baseClass = styles.seatStandard;
  if (seat.isOccupied) baseClass = styles.seatOccupied;
  else if (seat.isPremium) baseClass = styles.seatPremium;
  else if (seat.isExtraLegroom) baseClass = styles.seatExtraLegroom;

  return (
    <button 
      className={`${styles.seat} ${baseClass} ${isSelected ? styles.seatSelected : ''}`}
      onClick={onClick}
      disabled={seat.isOccupied}
      title={`${seat.id} - ${state.currencySymbol}${Math.round(seat.price * state.exchangeRate)}`}
    >
      {isSelected ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
      ) : (
        <span>{seat.col}</span>
      )}
    </button>
  );
}

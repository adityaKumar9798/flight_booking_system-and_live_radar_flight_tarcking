'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Passenger {
  id: string;
  type: 'Adult' | 'Child' | 'Infant';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phone?: string;
}

export interface Seat {
  passengerId: string;
  seatNumber: string;
  price: number;
}

export interface FlightSearch {
  from: string;
  to: string;
  date: string;
  adults: number;
  children: number;
  infants: number;
  travelClass: string;
  tripType: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  price: number;
  aircraft?: string;
  baggage?: string;
}

export interface BookingState {
  search: FlightSearch | null;
  selectedFlight: Flight | null;
  passengers: Passenger[];
  seats: Seat[];
  promoCode: string | null;
  discount: number;
  currency: string;
  currencySymbol: string;
  exchangeRate: number;
}

interface BookingContextType {
  state: BookingState;
  updateSearch: (search: FlightSearch) => void;
  selectFlight: (flight: Flight) => void;
  updatePassengers: (passengers: Passenger[]) => void;
  updateSeats: (seats: Seat[]) => void;
  applyPromoCode: (code: string, discountAmount: number) => void;
  setCurrencyPreference: (currency: string, symbol: string, rate: number) => void;
  clearBooking: () => void;
}

const initialState: BookingState = {
  search: null,
  selectedFlight: null,
  passengers: [],
  seats: [],
  promoCode: null,
  discount: 0,
  currency: 'USD',
  currencySymbol: '$',
  exchangeRate: 1,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('aerosky_booking_state');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse booking state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to local storage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('aerosky_booking_state', JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateSearch = (search: FlightSearch) => {
    setState((prev) => ({ ...prev, search }));
  };

  const selectFlight = (flight: Flight) => {
    setState((prev) => ({ ...prev, selectedFlight: flight }));
  };

  const updatePassengers = (passengers: Passenger[]) => {
    setState((prev) => ({ ...prev, passengers }));
  };

  const updateSeats = (seats: Seat[]) => {
    setState((prev) => ({ ...prev, seats }));
  };

  const applyPromoCode = (code: string, discount: number) => {
    setState((prev) => ({ ...prev, promoCode: code, discount }));
  };

  const setCurrencyPreference = (currency: string, symbol: string, rate: number) => {
    setState((prev) => ({ ...prev, currency, currencySymbol: symbol, exchangeRate: rate }));
  };

  const clearBooking = () => {
    // Preserve currency preference when clearing booking
    setState(prev => ({
      ...initialState,
      currency: prev.currency,
      currencySymbol: prev.currencySymbol,
      exchangeRate: prev.exchangeRate
    }));
    localStorage.removeItem('aerosky_booking_state');
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        updateSearch,
        selectFlight,
        updatePassengers,
        updateSeats,
        applyPromoCode,
        setCurrencyPreference,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

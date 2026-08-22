'use client';

import { useEffect, useState } from 'react';
import { useBooking } from '@/lib/booking-context';
import styles from './CountrySelectorModal.module.css';

interface CountrySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  { name: 'United States', code: 'US', currency: 'USD', symbol: '$', rate: 1 },
  { name: 'India', code: 'IN', currency: 'INR', symbol: '₹', rate: 83.5 },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', symbol: '£', rate: 0.79 },
  { name: 'Europe', code: 'EU', currency: 'EUR', symbol: '€', rate: 0.92 },
  { name: 'Australia', code: 'AU', currency: 'AUD', symbol: 'A$', rate: 1.52 },
  { name: 'Japan', code: 'JP', currency: 'JPY', symbol: '¥', rate: 155.0 },
];

export default function CountrySelectorModal({ isOpen, onClose }: CountrySelectorModalProps) {
  const { state, setCurrencyPreference } = useBooking();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSelect = (country: typeof countries[0]) => {
    setCurrencyPreference(country.currency, country.symbol, country.rate);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Select Country / Region</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <p className={styles.subtitle}>
          Select your region to view prices in your local currency.
        </p>
        
        <div className={styles.grid}>
          {countries.map(country => (
            <button 
              key={country.code} 
              className={`${styles.countryBtn} ${state.currency === country.currency ? styles.active : ''}`}
              onClick={() => handleSelect(country)}
            >
              <div className={styles.countryInfo}>
                <span className={styles.countryName}>{country.name}</span>
                <span className={styles.currencyCode}>{country.currency} ({country.symbol})</span>
              </div>
              {state.currency === country.currency && (
                <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

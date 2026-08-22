'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/lib/booking-context';
import styles from './Payment.module.css';

export default function PaymentPage() {
  const router = useRouter();
  const { state } = useBooking();
  
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  if (!state.selectedFlight) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (method === 'card') {
      if (!cardNumber || !expiry || !cvv || !name) {
        setError('Please fill in all card details.');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(() => {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        router.push('/booking/confirmation');
      } else {
        setError('Payment failed. Please try again or use a different card.');
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Payment</h1>
      <p className={styles.subtitle}>Select your preferred payment method to complete the booking.</p>

      {error && (
        <div className={styles.errorAlert}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePayment} className={styles.paymentGrid}>
        <div className={styles.methodsColumn}>
          <div className={`${styles.methodCard} ${method === 'card' ? styles.activeMethod : ''}`} onClick={() => setMethod('card')}>
            <div className={styles.radio}>
              <div className={method === 'card' ? styles.radioInner : ''}></div>
            </div>
            <div>
              <h4>Credit / Debit Card</h4>
              <p>Visa, MasterCard, Amex, RuPay</p>
            </div>
          </div>

          <div className={`${styles.methodCard} ${method === 'upi' ? styles.activeMethod : ''}`} onClick={() => setMethod('upi')}>
            <div className={styles.radio}>
              <div className={method === 'upi' ? styles.radioInner : ''}></div>
            </div>
            <div>
              <h4>UPI</h4>
              <p>Google Pay, PhonePe, Paytm</p>
            </div>
          </div>

          <div className={`${styles.methodCard} ${method === 'netbanking' ? styles.activeMethod : ''}`} onClick={() => setMethod('netbanking')}>
            <div className={styles.radio}>
              <div className={method === 'netbanking' ? styles.radioInner : ''}></div>
            </div>
            <div>
              <h4>Net Banking</h4>
              <p>All major banks supported</p>
            </div>
          </div>
        </div>

        <div className={styles.detailsColumn}>
          {method === 'card' && (
            <div className={styles.formSection}>
              <h3>Enter Card Details</h3>
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Name on Card</label>
                <input 
                  type="text" 
                  placeholder="Name on Card" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className={styles.rowGrid}>
                <div className={styles.formGroup}>
                  <label>Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    maxLength={4}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {method === 'upi' && (
            <div className={styles.formSection}>
              <h3>Pay with UPI</h3>
              <p className={styles.helperText}>Enter your UPI ID or VPA to receive a payment request on your UPI app.</p>
              <div className={styles.formGroup}>
                <label>UPI ID</label>
                <input type="text" placeholder="example@upi" />
              </div>
              <div className={styles.qrPlaceholder}>
                Or scan QR code (Demo only)
              </div>
            </div>
          )}

          {method === 'netbanking' && (
            <div className={styles.formSection}>
              <h3>Select Bank</h3>
              <div className={styles.formGroup}>
                <select defaultValue="">
                  <option value="" disabled>Select your bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
                </select>
              </div>
              <p className={styles.helperText}>You will be redirected to your bank's secure portal.</p>
            </div>
          )}

          <div className={styles.paymentActions}>
            <button 
              type="button" 
              className={styles.backBtn} 
              onClick={() => router.back()}
              disabled={isProcessing}
            >
              Back
            </button>
            <button 
              type="submit" 
              className={styles.payBtn}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
          
          <div className={styles.secureBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Payments are secure and encrypted.
          </div>
        </div>
      </form>
    </div>
  );
}

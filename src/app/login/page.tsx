'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './login.module.css';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (!email) {
      setError('Please enter your Travel ID');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleLogin = async () => {
    setError('');
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>
          {step === 1 ? 'Please enter your servicecard number or Travel ID (email address).' : 'Please enter your password.'}
        </p>

        <div className={styles.formGroup}>
          {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
          {step === 1 ? (
            <>
              <input 
                type="text" 
                className={styles.input} 
                placeholder="Travel ID (email address) / Servicecard number" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles.helpIcon} aria-label="Help">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
              </div>
            </>
          ) : (
            <input 
              type="password" 
              className={styles.input} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
        </div>



        <button 
          className={styles.nextBtn} 
          onClick={step === 1 ? handleNext : handleLogin}
          disabled={loading}
        >
          {loading ? 'Loading...' : (step === 1 ? 'Next' : 'Login')}
        </button>

        <div className={styles.divider}></div>

        <Link href="#" className={styles.forgotLink}>
          Forgot your PIN or password?
        </Link>

        <p className={styles.registerText}>
          If you do not yet have a Miles & More servicecard number or Travel ID, register now for Travel ID.
        </p>

        <Link href="/register" className={styles.registerLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
          Register for Travel ID
        </Link>
      </div>
    </div>
  );
}

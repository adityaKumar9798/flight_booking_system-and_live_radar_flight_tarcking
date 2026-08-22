'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import styles from './register.module.css';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // OTP State
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [milesAndMoreOption, setMilesAndMoreOption] = useState('create');
  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [consentEmail, setConsentEmail] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const handleNext = async () => {
    setError('');
    if (currentStep === 1) {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      if (!showOtpInput) {
        // Generate and send OTP
        setLoading(true);
        try {
          const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp(newOtp);
          
          const res = await fetch('/api/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp: newOtp })
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Failed to send OTP');
          }
          
          // FOR TESTING ONLY: Log the OTP to the browser console so you can proceed
          console.log(`[TESTING] Your OTP is: ${newOtp}`);
          
          setShowOtpInput(true);
        } catch (err: any) {
          setError(err.message || 'Error sending OTP email');
        } finally {
          setLoading(false);
        }
        return; // Don't advance step yet
      } else {
        // Verify OTP
        if (otpInput !== generatedOtp) {
          setError('Invalid OTP. Please try again.');
          return;
        }
        // OTP matches! Reset OTP state and let it advance
        setShowOtpInput(false);
      }
    } else if (currentStep === 3) {
      if (!firstName || !lastName || !dateOfBirth) {
        setError('Please fill in all personal data fields.');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleRegister = async () => {
    setError('');
    if (!consentTerms) {
      setError('You must accept the terms and conditions to register.');
      return;
    }
    setLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save the rest of the profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        milesAndMoreOption,
        title,
        firstName,
        lastName,
        dateOfBirth,
        consentEmail,
        createdAt: new Date().toISOString()
      });

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: 'Registration' },
    { id: 2, label: 'Miles & More' },
    { id: 3, label: 'Personal data' },
    { id: 4, label: 'Communication' },
    { id: 5, label: 'Confirmation' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.cancelLink}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          cancel
        </Link>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <ul className={styles.stepper}>
            {steps.map((step) => (
              <li key={step.id} className={`${styles.step} ${currentStep >= step.id ? styles.active : ''}`}>
                <div className={styles.stepNumber}>{step.id}</div>
                {step.label}
              </li>
            ))}
          </ul>

          <div className={styles.formSection}>
            {error && <p style={{ color: 'red', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{error}</p>}

            {/* STEP 1: Registration */}
            {currentStep === 1 && (
              <>
                <h1 className={styles.title}>{showOtpInput ? 'Verify your email' : 'Specify your access details'}</h1>
                <p className={styles.subtitle}>
                  {showOtpInput 
                    ? `We sent a 6-digit OTP to ${email}. Please enter it below.` 
                    : 'Please enter your email address and set a password.'}
                </p>
                
                {!showOtpInput ? (
                  <>
                    <div className={styles.formGroup}>
                      <input 
                        type="email" 
                        className={styles.input} 
                        placeholder="Travel ID (email address)" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className={styles.input} 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button 
                        className={styles.eyeIcon} 
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.formGroup}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="6-digit OTP" 
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                )}
              </>
            )}

            {/* STEP 2: Miles & More */}
            {currentStep === 2 && (
              <>
                <h1 className={styles.title}>Miles & More</h1>
                <p className={styles.subtitle}>Would you like to earn miles with your Travel ID?</p>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="create" checked={milesAndMoreOption === 'create'} onChange={(e) => setMilesAndMoreOption(e.target.value)} />
                    Yes, sign me up for a new Miles & More account.
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="link" checked={milesAndMoreOption === 'link'} onChange={(e) => setMilesAndMoreOption(e.target.value)} />
                    I already have a Miles & More account, link it later.
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="none" checked={milesAndMoreOption === 'none'} onChange={(e) => setMilesAndMoreOption(e.target.value)} />
                    No, I do not wish to collect miles at this time.
                  </label>
                </div>
              </>
            )}

            {/* STEP 3: Personal Data */}
            {currentStep === 3 && (
              <>
                <h1 className={styles.title}>Personal data</h1>
                <p className={styles.subtitle}>Please provide your name and date of birth exactly as they appear on your passport.</p>
                <div className={styles.grid2}>
                  <div className={styles.formGroup}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="Title (Optional)" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div></div>
                  <div className={styles.formGroup}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="First name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input 
                      type="text" 
                      className={styles.input} 
                      placeholder="Last name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <input 
                    type="date" 
                    className={styles.input} 
                    placeholder="Date of birth" 
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
              </>
            )}

            {/* STEP 4: Communication */}
            {currentStep === 4 && (
              <>
                <h1 className={styles.title}>Communication</h1>
                <p className={styles.subtitle}>Stay informed about your flights and special offers.</p>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={consentEmail} onChange={(e) => setConsentEmail(e.target.checked)} />
                  <span>I would like to receive personalized offers, flight updates, and marketing communications from Aerosky via email.</span>
                </label>
              </>
            )}

            {/* STEP 5: Confirmation */}
            {currentStep === 5 && (
              <>
                <h1 className={styles.title}>Confirmation</h1>
                <p className={styles.subtitle}>Please review your details before completing registration.</p>
                
                <div className={styles.summaryBox}>
                  <div className={styles.summaryItem}><strong>Email:</strong> {email}</div>
                  <div className={styles.summaryItem}><strong>Name:</strong> {firstName} {lastName}</div>
                  <div className={styles.summaryItem}><strong>Date of Birth:</strong> {dateOfBirth}</div>
                  <div className={styles.summaryItem}><strong>Earn Miles:</strong> {milesAndMoreOption === 'create' ? 'Yes (Create new)' : milesAndMoreOption === 'link' ? 'Link later' : 'No'}</div>
                </div>

                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={consentTerms} onChange={(e) => setConsentTerms(e.target.checked)} />
                  <span>I have read and agree to the Terms of Service and Privacy Policy. I confirm that all provided information is accurate.</span>
                </label>
              </>
            )}

            {/* ACTION ROW */}
            <div className={styles.actionRow}>
              {currentStep > 1 && (
                <button 
                  className={styles.continueBtn} 
                  style={{ backgroundColor: '#f0f0f0', color: '#333', marginRight: '1rem' }} 
                  onClick={() => { setError(''); setCurrentStep((prev) => prev - 1); }}
                >
                  Back
                </button>
              )}
              {currentStep === 1 && showOtpInput && (
                <button 
                  className={styles.continueBtn} 
                  style={{ backgroundColor: '#f0f0f0', color: '#333', marginRight: '1rem' }} 
                  onClick={() => { setError(''); setShowOtpInput(false); setOtpInput(''); }}
                >
                  Back
                </button>
              )}
              {currentStep < 5 ? (
                <button className={styles.continueBtn} onClick={handleNext} disabled={loading}>
                  {loading ? 'Sending...' : showOtpInput ? 'Verify OTP' : 'Continue'}
                </button>
              ) : (
                <button className={styles.continueBtn} onClick={handleRegister} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>

            {/* LOGIN PROMPT */}
            {currentStep === 1 && (
              <div className={styles.loginPrompt}>
                Do you already have a Travel ID or Miles & More servicecard number?
                <Link href="/login" className={styles.loginLink}>
                  Log in now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

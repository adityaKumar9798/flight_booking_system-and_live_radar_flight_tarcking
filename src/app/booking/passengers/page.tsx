'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBooking, Passenger } from '@/lib/booking-context';
import styles from './Passengers.module.css';

export default function PassengersPage() {
  const router = useRouter();
  const { state, updatePassengers } = useBooking();
  const totalPassengers = state.search?.adults || 1;

  // Initialize form state
  const [formData, setFormData] = useState<Passenger[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // If we have no selected flight, redirect to home
    if (!state.selectedFlight) {
      router.push('/');
      return;
    }

    // Populate initial passengers array based on search context or existing state
    if (state.passengers.length > 0) {
      setFormData(state.passengers);
    } else {
      const initial: Passenger[] = [];
      for (let i = 0; i < totalPassengers; i++) {
        initial.push({
          id: `p-${i}`,
          type: 'Adult',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          gender: 'Male',
          email: i === 0 ? '' : undefined,
          phone: i === 0 ? '' : undefined,
        });
      }
      setFormData(initial);
    }
  }, [state.selectedFlight, state.passengers, totalPassengers, router]);

  const handleChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...formData];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(updated);
    
    // Clear error
    if (errors[`${index}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    formData.forEach((p, i) => {
      if (!p.firstName.trim()) { newErrors[`${i}-firstName`] = 'First name is required'; isValid = false; }
      if (!p.lastName.trim()) { newErrors[`${i}-lastName`] = 'Last name is required'; isValid = false; }
      if (!p.dateOfBirth) { newErrors[`${i}-dateOfBirth`] = 'Date of birth is required'; isValid = false; }
      
      // Primary passenger contact info
      if (i === 0) {
        if (!p.email?.trim() || !/^\S+@\S+\.\S+$/.test(p.email)) {
          newErrors[`${i}-email`] = 'Valid email is required'; isValid = false;
        }
        if (!p.phone?.trim() || p.phone.length < 10) {
          newErrors[`${i}-phone`] = 'Valid phone number is required'; isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      updatePassengers(formData);
      router.push('/booking/seats');
    }
  };

  if (!state.selectedFlight) return null; // Avoid flashing

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Passenger Details</h1>
      <p className={styles.subtitle}>Please enter the exact name as it appears on your passport or travel document.</p>

      <form onSubmit={handleSubmit}>
        {formData.map((passenger, index) => (
          <div key={passenger.id} className={styles.passengerCard}>
            <div className={styles.cardHeader}>
              <h3>{index === 0 ? 'Primary Passenger' : `Passenger ${index + 1}`}</h3>
              <span className={styles.badge}>{passenger.type}</span>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={passenger.firstName} 
                    onChange={(e) => handleChange(index, 'firstName', e.target.value)}
                    className={errors[`${index}-firstName`] ? styles.errorInput : ''}
                    placeholder="First Name"
                  />
                  {errors[`${index}-firstName`] && <span className={styles.errorText}>{errors[`${index}-firstName`]}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={passenger.lastName} 
                    onChange={(e) => handleChange(index, 'lastName', e.target.value)}
                    className={errors[`${index}-lastName`] ? styles.errorInput : ''}
                    placeholder="Last Name"
                  />
                  {errors[`${index}-lastName`] && <span className={styles.errorText}>{errors[`${index}-lastName`]}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={passenger.dateOfBirth} 
                    onChange={(e) => handleChange(index, 'dateOfBirth', e.target.value)}
                    className={errors[`${index}-dateOfBirth`] ? styles.errorInput : ''}
                  />
                  {errors[`${index}-dateOfBirth`] && <span className={styles.errorText}>{errors[`${index}-dateOfBirth`]}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label>Gender</label>
                  <select 
                    value={passenger.gender} 
                    onChange={(e) => handleChange(index, 'gender', e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {index === 0 && (
                <div className={styles.contactSection}>
                  <h4>Contact Information</h4>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={passenger.email || ''} 
                        onChange={(e) => handleChange(index, 'email', e.target.value)}
                        className={errors[`${index}-email`] ? styles.errorInput : ''}
                        placeholder="Email Address"
                      />
                      {errors[`${index}-email`] && <span className={styles.errorText}>{errors[`${index}-email`]}</span>}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        value={passenger.phone || ''} 
                        onChange={(e) => handleChange(index, 'phone', e.target.value)}
                        className={errors[`${index}-phone`] ? styles.errorInput : ''}
                        placeholder="Phone Number"
                      />
                      {errors[`${index}-phone`] && <span className={styles.errorText}>{errors[`${index}-phone`]}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className={styles.actions}>
          <button type="button" className={styles.backBtn} onClick={() => router.back()}>Back</button>
          <button type="submit" className={styles.continueBtn}>Continue to Seats</button>
        </div>
      </form>
    </div>
  );
}

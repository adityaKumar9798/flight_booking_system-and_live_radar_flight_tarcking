'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useBooking } from '@/lib/booking-context';
import styles from './Sidebar.module.css';
import LogoutModal from '@/components/ui/LogoutModal';
import CountrySelectorModal from './CountrySelectorModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const { state } = useBooking();

  // Map currency to country name for the menu
  const getCountryName = () => {
    switch (state.currency) {
      case 'INR': return 'India';
      case 'GBP': return 'United Kingdom';
      case 'EUR': return 'Europe';
      case 'AUD': return 'Australia';
      case 'JPY': return 'Japan';
      default: return 'United States';
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data.firstName || 'User');
            setIsAdmin(data.isAdmin === true);
          } else {
            setUserName('User');
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserName('User');
        }
      } else {
        setUserName(null);
      }
      setLoadingUser(false);
    });
    return () => unsubscribe();
  }, []);

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const mainLinks = [
    { title: 'Book & Prepare', href: '#' },
    { title: 'My bookings', href: '#' },
    { title: 'Discover Aerosky', href: '#' },
    { title: '100 Years Aerosky', href: '#' },
  ];

  const countryName = getCountryName();

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className={styles.content}>
          <nav className={styles.mainNav}>
            {mainLinks.map((link) => (
              <Link key={link.title} href={link.href} className={styles.mainNavItem} onClick={onClose}>
                {link.title}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>
            ))}
          </nav>
          
          <nav className={styles.footerNav}>
            <Link href="#" className={styles.footerNavItem} onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              Accessible travel
            </Link>
            
            <Link href="#" className={styles.footerNavItem} onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Help & contact
            </Link>
            
            <button 
              onClick={() => { setIsCountryModalOpen(true); onClose(); }} 
              className={styles.footerNavItem}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              {countryName} | English
            </button>
            
            {loadingUser ? (
              <span className={styles.footerNavItem} style={{ opacity: 0.5 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ...
              </span>
            ) : userName ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className={styles.footerNavItem} onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                    Admin Dashboard
                  </Link>
                )}
                <button 
                className={styles.footerNavItem} 
                onClick={() => setIsLogoutModalOpen(true)} 
                title="Click to Logout"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {userName} (Logout)
              </button>
              </>
            ) : (
              <Link href="/login" className={styles.footerNavItem} onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Login
              </Link>
            )}
          </nav>
        </div>
      </aside>
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} onSuccess={onClose} />
      <CountrySelectorModal isOpen={isCountryModalOpen} onClose={() => setIsCountryModalOpen(false)} />
    </>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import styles from './Header.module.css';
import Sidebar from './Sidebar';
import LogoutModal from '@/components/ui/LogoutModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().firstName || 'User');
          } else {
            setUserName('User');
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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHidden(true); // Scrolling down
      } else {
        setHidden(false); // Scrolling up
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${hidden ? styles.hidden : ''}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" />
          </svg>
          <span>Aerosky</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Book</Link>
          <Link href="/my-trips" className={styles.navLink}>My flights</Link>
          <Link href="/check-in" className={styles.navLink}>Check-in</Link>
          <Link href="/flight-status" className={styles.navLink}>Flight status</Link>
        </nav>
        <div className={styles.actions}>
          {loadingUser ? (
            <div className={styles.actionBtn}>
              <span style={{opacity: 0.5}}>...</span>
            </div>
          ) : userName ? (
            <button className={styles.actionBtn} onClick={() => setIsLogoutModalOpen(true)} title="Click to Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {userName}
            </button>
          ) : (
            <Link href="/login" className={styles.actionBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Login
            </Link>
          )}
          <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            Menu
          </button>
        </div>
      </div>
    </header>
    <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
    </>
  );
}

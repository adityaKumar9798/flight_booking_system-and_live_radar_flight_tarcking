'use client';

import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'users'))
        ]);

        let totalRev = 0;
        bookingsSnap.forEach(doc => {
          totalRev += doc.data().totalPaid || 0;
        });

        // Format revenue to Lakhs if > 100000
        const revFormatted = totalRev >= 100000 
          ? `₹${(totalRev / 100000).toFixed(1)}L` 
          : `₹${totalRev.toLocaleString()}`;

        setStats({
          bookings: bookingsSnap.size,
          revenue: revFormatted as any,
          users: usersSnap.size
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Good morning, Admin</h1>
          <p className={styles.subtitle}>Here's what's happening with AeroSky today.</p>
        </div>
        <div className={styles.actions}>
          <span className={styles.date}>{today}</span>
          <button className={styles.btn}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            Refresh
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Export Report
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>TOTAL BOOKINGS</div>
              <div className={styles.statValue}>{loading ? '...' : stats.bookings}</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeSuccess}>+18.4%</span>
            <span className={styles.statDesc}>vs last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>TOTAL REVENUE</div>
              <div className={styles.statValue}>{loading ? '...' : stats.revenue}</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeSuccess}>+12.6%</span>
            <span className={styles.statDesc}>vs last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>ACTIVE FLIGHTS</div>
              <div className={styles.statValue}>86</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" /></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeNeutral}>LIVE</span>
            <span className={styles.statDesc}>24 currently in air</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>TOTAL USERS</div>
              <div className={styles.statValue}>{loading ? '...' : stats.users}</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeSuccess}>+8.2%</span>
            <span className={styles.statDesc}>new registrations</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>CANCELLATIONS</div>
              <div className={styles.statValue}>94</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeDanger}>7.5%</span>
            <span className={styles.statDesc}>cancellation rate</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <div>
              <div className={styles.statLabel}>PENDING REFUNDS</div>
              <div className={styles.statValue}>18</div>
            </div>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
            </div>
          </div>
          <div className={styles.statFooter}>
            <span className={styles.badgeNeutral}>₹1.42L</span>
            <span className={styles.statDesc}>total pending value</span>
          </div>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            Booking Overview
            <div className={styles.filters}>
              <button className={styles.filterBtn}>7D</button>
              <button className={`${styles.filterBtn} ${styles.active}`}>30D</button>
              <button className={styles.filterBtn}>3M</button>
            </div>
          </div>
          
          <div className={styles.mockChart}>
            {/* CSS Mock Chart generated via div bars */}
            {[60, 45, 80, 50, 75, 90, 65].map((h, i) => (
              <div key={i} className={styles.chartBarGroup}>
                <div className={styles.chartBar} style={{height: `${h}%`, animationDelay: `${i * 0.08}s`}}></div>
                <div className={`${styles.chartBar} ${styles.secondary}`} style={{height: `${h * 0.4}%`, animationDelay: `${i * 0.08 + 0.05}s`}}></div>
                <div className={`${styles.chartBar} ${styles.tertiary}`} style={{height: `${h * 0.15}%`, animationDelay: `${i * 0.08 + 0.1}s`}}></div>
                <div className={styles.chartLabel}>Day {i*4 + 1}</div>
              </div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-light)'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: 12, height: 12, background: 'var(--primary)', borderRadius: '50%'}}></span> Confirmed</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: 12, height: 12, background: 'var(--secondary)', borderRadius: '50%'}}></span> Pending</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '8px'}}><span style={{width: 12, height: 12, background: '#e2e8f0', borderRadius: '50%'}}></span> Cancelled</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitle}>Top Routes</div>
          <div>
            {[
              { route: 'Delhi → Mumbai', bookings: '1,248', rev: '₹8.4L' },
              { route: 'Ranchi → Delhi', bookings: '982', rev: '₹6.1L' },
              { route: 'Mumbai → Bangalore', bookings: '875', rev: '₹5.7L' },
              { route: 'Kolkata → Delhi', bookings: '742', rev: '₹4.8L' }
            ].map((r, idx) => (
              <div key={idx} className={styles.routeItem}>
                <div>
                  <div className={styles.routePath}>{r.route}</div>
                  <div className={styles.routeStats}>{r.bookings} bookings</div>
                </div>
                <div className={styles.routeRevenue}>{r.rev}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

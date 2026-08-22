'use client';
import { useState } from 'react';
import styles from './ExtraServices.module.css';

export default function ExtraServices() {
  const [activeCard, setActiveCard] = useState<number | null>(1); // Default to Rental car (index 1)

  const services = [
    {
      title: "Hotels",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6v14M20 6v14M4 10h16M4 14h16M12 6v14" />
        </svg>
      )
    },
    {
      title: "Rental car",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H7.5a2 2 0 0 0-1.8 1.1L3 12l-1 4.5v1.5h2m10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm-10 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"/>
          <circle cx="16" cy="6" r="4" /><path d="M16 4v2l1.5 1.5" />
        </svg>
      )
    },
    {
      title: "Parking at the airport",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
           <circle cx="12" cy="12" r="11" />
           <path fill="white" d="M9 7h4.5a3.5 3.5 0 0 1 0 7H11v3H9V7zm2 4.5h2.5a1.5 1.5 0 0 0 0-3H11v3z" />
        </svg>
      )
    },
    {
      title: "Tours and activities",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 8c0-2.2 3.1-4 7-4s7 1.8 7 4H5z"/>
          <rect fill="white" x="14" y="6" width="6" height="4" rx="1" />
          <circle fill="var(--primary)" cx="17" cy="8" r="1" />
        </svg>
      )
    },
    {
      title: "All extra services",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="11" />
          <path fill="white" d="M11 6h2v5h5v2h-5v5h-2v-5H6v-2h5V6z" />
        </svg>
      )
    }
  ];

  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.title}>Looking for more than just a flight?</h2>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`${styles.card} ${activeCard === index ? styles.active : ''}`}
              onClick={() => setActiveCard(index)}
            >
              <div className={styles.icon}>{service.icon}</div>
              <div className={styles.cardTitle}>{service.title}</div>
            </div>
          ))}
        </div>
        
        <div className={styles.footerTop}>
          <div className={styles.paymentSection}>
            <h3 className={styles.footerSubtitle}>Payment options</h3>
            <div className={styles.paymentIcons}>
              {/* Payment mock logos */}
              <div className={styles.payIcon} style={{display:'flex'}}>
                <div style={{width:'12px', height:'24px', background:'#eb001b', borderRadius:'12px 0 0 12px'}}></div>
                <div style={{width:'12px', height:'24px', background:'#f79e1b', borderRadius:'0 12px 12px 0'}}></div>
              </div>
              <div className={styles.payIcon} style={{color: '#1a1f71', fontSize: '1.2rem'}}>VISA</div>
              <div className={styles.payIcon} style={{color: '#2566af', fontSize: '1.1rem'}}>AMEX</div>
              <div className={styles.payIcon} style={{color: '#00579c'}}>Diners</div>
              <div className={styles.payIcon} style={{color: '#0070ba'}}>JCB</div>
              <div className={styles.payIcon} style={{color: '#00457c'}}>UATP</div>
              <div className={styles.payIcon} style={{color: '#003087', fontStyle: 'italic', fontSize: '1.1rem'}}>PayPal</div>
              <div className={styles.payIcon} style={{color: '#ffb3c6'}}>Klarna</div>
            </div>
          </div>
          
          <div className={styles.socialSection}>
            <h3 className={styles.footerSubtitle}>Follow us</h3>
            <div className={styles.socialIcons}>
              <div className={styles.socialIcon} style={{color: '#1877F2'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div className={styles.socialIcon} style={{color: '#FF0000'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <div className={styles.socialIcon} style={{color: '#E1306C'}}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
              </div>
              <div className={styles.socialIcon} style={{color: '#000000'}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

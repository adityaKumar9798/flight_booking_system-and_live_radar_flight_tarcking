'use client';
import { useEffect, useRef } from 'react';
import styles from './PromotionalSection.module.css';

export default function PromotionalSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const offers = [
    {
      title: "20% Off with Promo Code",
      tag: "Special Offer",
      image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop",
      link: "Celebrating 100 Years of Aerosky"
    },
    {
      title: "Explore Europe this Summer",
      tag: "Destinations",
      image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
      link: "Book early and save"
    },
    {
      title: "Upgrade to Business Class",
      tag: "Premium Experience",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
      link: "Enjoy more space and comfort"
    }
  ];

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className="container">
        <h2 className={`${styles.title} reveal`}>Our highlights</h2>
        <div className={styles.grid}>
          {offers.map((offer, index) => (
            <div key={index} className={`${styles.card} reveal`} style={{ transitionDelay: `${index * 0.2}s` }}>
              <div className={styles.image} style={{ backgroundImage: `url(${offer.image})` }}></div>
              <div className={styles.content}>
                <div className={styles.tag}>{offer.tag}</div>
                <h3 className={styles.cardTitle}>{offer.title}</h3>
                <div className={styles.link}>
                  {offer.link}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

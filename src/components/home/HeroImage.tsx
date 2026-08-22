import styles from './HeroImage.module.css';
import Link from 'next/link';

export default function HeroImage() {
  return (
    <section className={styles.heroImageSection}>
      <div className={styles.overlayContainer}>
        <div className={styles.promoCard}>
          <div className={styles.specialOffer}>Special Offer</div>
          <h2 className={styles.promoTitle}>20% Off with Promo code AERO100</h2>
          <Link href="#" className={styles.promoLink}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            Celebrating 100 Years of Aerosky
          </Link>
        </div>
      </div>
    </section>
  );
}

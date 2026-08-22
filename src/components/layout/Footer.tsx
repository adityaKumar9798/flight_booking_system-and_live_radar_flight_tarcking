import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const sections = [
    {
      title: "Frequently visited pages",
      links: ["Book a flight", "Offers & destinations", "Baggage", "Check-in"]
    },
    {
      title: "Customer services",
      links: ["Help & Contact", "Feedback", "Newsletter", "Receipts"]
    },
    {
      title: "About us",
      links: ["Aerosky Group", "Careers", "Sustainability", "Press"]
    },
    {
      title: "Corporate customers",
      links: ["For corporate customers", "For travel agents", "Aerosky Cargo"]
    }
  ];

  const legalLinks = [
    "Imprint",
    "General Conditions of Carriage",
    "Data protection",
    "Passenger rights",
    "Accessibility Statement",
    "Arbitration board",
    "Terms of use"
  ];

  return (
    <footer className={styles.footer}>
      {/* --- DESKTOP FOOTER --- */}
      <div className={styles.desktopFooter}>
        <div className="container">
          <div className={styles.desktopTop}>
            <div className={styles.footerSearch}>
              <input type="text" placeholder="Enter search term" />
              <button>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></svg>
              </button>
            </div>
            <div className={styles.footerRegion}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
              India | English
            </div>
          </div>

          <div className={styles.grid}>
            {sections.map((sec, idx) => (
              <div key={idx} className={styles.column}>
                <h3>{sec.title}</h3>
                <ul>
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}><Link href="#">{link}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.bottom}>
            <div className={styles.legal}>
              {legalLinks.map((link, idx) => (
                <Link key={idx} href="#" className={styles.legalLink}>
                  <span className={styles.arrow}>&rarr;</span> {link}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.desktopBrandBand}>
          <div className={`container ${styles.desktopBrandContainer}`}>
            <div className={styles.desktopBrandLeft}>
              <div className={styles.desktopLogo}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#05164d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="11" />
                  <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" />
                </svg>
                <span className={styles.desktopLogoText}>Aerosky</span>
              </div>
              <div className={styles.desktopMember}>Member of <strong>AEROSKY GROUP</strong></div>
            </div>
            <div className={styles.desktopAlliance}>
              STAR ALLIANCE
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE FOOTER --- */}
      <div className={styles.mobileFooter}>
        <div className={styles.accordionGroup}>
          {sections.map((sec, idx) => (
            <details key={idx} className={styles.accordion}>
              <summary className={styles.accordionHeader}>
                {sec.title}
                <svg className={styles.accordionIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </summary>
              <div className={styles.accordionContent}>
                <ul>
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}><Link href="#">{link}</Link></li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>

        <div className={styles.mobileSettings}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
          India | English
        </div>

        <div className={styles.mobileLegalGrid}>
          {legalLinks.map((link, idx) => (
            <Link key={idx} href="#" className={styles.mobileLegalLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              {link}
            </Link>
          ))}
        </div>

        <div className={styles.mobileBrand}>
          <div className={styles.mobileLogo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" />
            </svg>
            Aerosky
          </div>
          <div className={styles.mobileMember}>Member of AEROSKY GROUP</div>
          <div className={styles.mobileAlliance}>
            STAR ALLIANCE
            <svg width="50" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

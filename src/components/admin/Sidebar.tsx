'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const menuGroups = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin' }]
  },
  {
    title: 'Flight Management',
    items: [
      { label: 'Flights', path: '/admin/flights' },
      { label: 'Flight Operations', path: '/admin/flight-operations' },
      { label: 'Airlines', path: '/admin/airlines' },
      { label: 'Airports', path: '/admin/airports' }
    ]
  },
  {
    title: 'Booking Management',
    items: [
      { label: 'Bookings', path: '/admin/bookings' },
      { label: 'Passengers', path: '/admin/passengers' },
      { label: 'Payments', path: '/admin/payments' },
      { label: 'Refunds', path: '/admin/refunds' },
      { label: 'Coupons', path: '/admin/coupons' }
    ]
  },
  {
    title: 'Customers',
    items: [{ label: 'Users', path: '/admin/users' }]
  },
  {
    title: 'Communication',
    items: [{ label: 'Notifications', path: '/admin/notifications' }]
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Analytics', path: '/admin/analytics' },
      { label: 'AI Copilot', path: '/admin/ai-copilot' }
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Activity Logs', path: '/admin/activity-logs' },
      { label: 'Settings', path: '/admin/settings' }
    ]
  }
];

export default function AdminSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <div className={styles.brand}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 4-3 3-3-1-1.5 1.5L8 18l1.5-1.5-1-3 3-3 4 6l1.2-.7-.9-1.3z" /></svg>
        AeroSky <span className={styles.adminBadge}>ADMIN</span>
      </div>

      <div className={styles.menu}>
        {menuGroups.map((group, idx) => (
          <div key={idx} className={styles.section}>
            <div className={styles.sectionTitle}>{group.title}</div>
            {group.items.map((item, i) => {
              const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
              return (
                <Link 
                  href={item.path} 
                  key={i} 
                  className={`${styles.link} ${active ? styles.active : ''}`}
                  onClick={() => window.innerWidth <= 900 && setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className={styles.bottomMenu}>
        <Link href="/admin/profile" className={`${styles.link} ${pathname === '/admin/profile' ? styles.active : ''}`}>
          Admin Profile
        </Link>
        <button className={styles.link} style={{width: '100%', textAlign: 'left'}}>
          Logout
        </button>
      </div>
    </aside>
  );
}

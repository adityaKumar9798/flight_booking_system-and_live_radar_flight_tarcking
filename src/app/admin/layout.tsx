'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/Navbar';
import styles from './layout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {sidebarOpen && window.innerWidth <= 900 && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className={styles.mainContent}>
        <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={styles.scrollArea}>
          {children}
        </main>
      </div>
    </div>
  );
}

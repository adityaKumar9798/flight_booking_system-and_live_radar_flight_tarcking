'use client';

import React from 'react';
import styles from './AdminTable.module.css';

interface Column {
  key: string;
  label: string;
  isBadge?: boolean;
}

interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  primaryAction?: string;
  onPrimaryActionClick?: () => void;
  onViewClick?: (row: any) => void;
  onEditClick?: (row: any) => void;
}

export default function AdminTable({ title, columns, data, primaryAction, onPrimaryActionClick, onViewClick, onEditClick }: AdminTableProps) {
  
  const getBadgeClass = (val: string) => {
    const lower = (val || '').toLowerCase();
    if (['active', 'confirmed', 'successful', 'approved', 'completed', 'on time'].includes(lower)) return styles.badgeSuccess;
    if (['pending', 'processing', 'delayed'].includes(lower)) return styles.badgeWarning;
    if (['cancelled', 'failed', 'rejected', 'blocked', 'suspended'].includes(lower)) return styles.badgeDanger;
    return styles.badgeNeutral;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>
          <button className={styles.btn}>Filter</button>
          {primaryAction && <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onPrimaryActionClick}>{primaryAction}</button>}
        </div>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(c => <th key={c.key}>{c.label}</th>)}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map(c => (
                  <td key={c.key}>
                    {c.isBadge ? (
                      <span className={`${styles.badge} ${getBadgeClass(row[c.key])}`}>{row[c.key]}</span>
                    ) : (
                      row[c.key]
                    )}
                  </td>
                ))}
                <td>
                  <div className={styles.actionCell}>
                    <button className={styles.actionBtn} onClick={() => onViewClick?.(row)}>View</button>
                    <button className={styles.actionBtn} onClick={() => onEditClick?.(row)}>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>Showing 1 to {data.length} of {data.length} entries</span>
        <div className={styles.actions}>
          <button className={styles.btn} disabled>Previous</button>
          <button className={styles.btn} disabled>Next</button>
        </div>
      </div>
    </div>
  );
}

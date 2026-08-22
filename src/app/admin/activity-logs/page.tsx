'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function ActivityLogsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'admin', label: 'Admin' },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Time' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const q = query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const logsList = querySnapshot.docs.map(doc => {
          const d = doc.data();
          const timestamp = d.createdAt ? new Date(d.createdAt.toMillis()) : new Date();
          return {
            id: doc.id,
            admin: d.admin || 'System',
            action: d.action,
            target: d.target,
            date: timestamp.toLocaleDateString(),
            time: timestamp.toLocaleTimeString(),
            status: d.status || 'Successful'
          };
        });
        
        // If no real logs yet, show a placeholder
        if (logsList.length === 0) {
           setData([{
             id: '1', admin: 'System', action: 'Dashboard Initialized', target: 'Firebase DB', date: new Date().toLocaleDateString(), time: new Date().toLocaleTimeString(), status: 'Successful'
           }]);
        } else {
          setData(logsList);
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading system logs...</div>;
  }

  return <AdminTable title="System Activity Logs" columns={columns} data={data} primaryAction="Export Logs" />;
}

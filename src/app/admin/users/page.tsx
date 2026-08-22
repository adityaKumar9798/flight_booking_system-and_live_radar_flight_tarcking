'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function UsersAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'bookings', label: 'Total Bookings' },
    { key: 'spent', label: 'Total Spent' },
    { key: 'date', label: 'Registration Date' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const fetchedData = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Unknown User',
            email: d.email || 'N/A',
            phone: d.phone || 'N/A',
            bookings: d.bookingsCount || '0',
            spent: `₹${(d.totalSpent || 0).toLocaleString()}`,
            date: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'N/A',
            status: d.status || 'Active'
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading user data...</div>;
  }

  return <AdminTable title="User Management" columns={columns} data={data} primaryAction="+ Add User" />;
}

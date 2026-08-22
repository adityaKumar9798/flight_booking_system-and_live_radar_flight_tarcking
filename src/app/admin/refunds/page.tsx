'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export default function RefundsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'passenger', label: 'Passenger' },
    { key: 'amount', label: 'Refund Amount' },
    { key: 'reason', label: 'Reason' },
    { key: 'date', label: 'Requested Date' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const q = query(collection(db, 'bookings'), where('status', '==', 'Cancelled'));
        const querySnapshot = await getDocs(q);
        const refundsList: any[] = [];
        
        querySnapshot.docs.forEach(doc => {
          const d = doc.data();
          const primaryPassenger = d.passengers && d.passengers.length > 0 
            ? `${d.passengers[0].firstName} ${d.passengers[0].lastName}` 
            : 'Unknown';
            
          refundsList.push({
            id: doc.id,
            bookingId: d.bookingId,
            passenger: primaryPassenger,
            amount: `₹${(d.totalPaid || 0).toLocaleString()}`,
            reason: 'User Cancelled',
            date: new Date(d.dateBooked).toLocaleDateString(), // Mocking request date
            status: 'Pending'
          });
        });
        
        setData(refundsList);
      } catch (error) {
        console.error("Error fetching refunds:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRefunds();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading refunds...</div>;
  }

  return <AdminTable title="Refund Processing" columns={columns} data={data} primaryAction="Process Batch" />;
}

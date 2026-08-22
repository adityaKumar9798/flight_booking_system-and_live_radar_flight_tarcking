'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function PaymentsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const columns = [
    { key: 'transactionId', label: 'Transaction ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'user', label: 'User' },
    { key: 'amount', label: 'Amount' },
    { key: 'method', label: 'Payment Method' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const q = query(collection(db, 'bookings'));
        const querySnapshot = await getDocs(q);
        const paymentsList: any[] = [];
        
        querySnapshot.docs.forEach(doc => {
          const d = doc.data();
          const primaryPassenger = d.passengers && d.passengers.length > 0 
            ? `${d.passengers[0].firstName} ${d.passengers[0].lastName}` 
            : 'Unknown User';
            
          paymentsList.push({
            id: doc.id,
            transactionId: `TXN-${doc.id.substring(0, 8).toUpperCase()}`,
            bookingId: d.bookingId,
            user: primaryPassenger,
            amount: `₹${Math.round((d.totalPaid || 0) * (d.exchangeRate || 83.5)).toLocaleString()}`,
            method: 'Credit Card', // Mocked until Razorpay is fully integrated
            date: new Date(d.dateBooked).toLocaleDateString(),
            status: 'Successful', // Bookings in DB are usually successful
            _rawDate: d.dateBooked // Keep for sorting
          });
        });
        
        // Sort in JS to avoid requiring a composite index
        paymentsList.sort((a, b) => new Date(b._rawDate).getTime() - new Date(a._rawDate).getTime());
        
        setData(paymentsList);
      } catch (error: any) {
        console.warn("Could not fetch payments (Permissions or Index error):", error.message);
        setErrorMsg("Missing or insufficient permissions. Please check your Firebase rules.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading payment history...</div>;
  }

  if (errorMsg) {
    return (
      <div style={{padding: '24px', color: '#ef4444'}}>
        <h2>Database Error</h2>
        <p>{errorMsg}</p>
        <p style={{marginTop: '8px', color: '#a3a3a3'}}>
          Make sure your Firestore rules are set to <code>allow read, write: if true;</code>
        </p>
      </div>
    );
  }

  return <AdminTable title="Payment History" columns={columns} data={data} primaryAction="Export CSV" />;
}

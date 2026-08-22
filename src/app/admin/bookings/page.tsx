'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function BookingsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'pnr', label: 'PNR' },
    { key: 'passenger', label: 'Primary Passenger' },
    { key: 'flight', label: 'Flight' },
    { key: 'route', label: 'Route' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, 'bookings'), orderBy('dateBooked', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => {
          const d = doc.data();
          const primaryPassenger = d.passengers && d.passengers.length > 0 
            ? `${d.passengers[0].firstName} ${d.passengers[0].lastName}` 
            : 'Unknown';
          
          return {
            id: doc.id,
            bookingId: d.bookingId,
            pnr: d.pnr,
            passenger: primaryPassenger,
            flight: d.flight?.airline?.iata + d.flight?.flight?.number,
            route: `${d.flight?.departure?.iata} → ${d.flight?.arrival?.iata}`,
            amount: `₹${d.totalPaid?.toLocaleString()}`,
            status: d.status
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading bookings data...</div>;
  }

  return <AdminTable title="Booking Management" columns={columns} data={data} primaryAction="Export Bookings" />;
}

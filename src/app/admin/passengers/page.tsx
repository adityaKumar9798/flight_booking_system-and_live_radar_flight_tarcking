'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function PassengersAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { key: 'name', label: 'Passenger Name' },
    { key: 'type', label: 'Type' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'flight', label: 'Flight' },
    { key: 'seat', label: 'Seat' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const q = query(collection(db, 'bookings'), orderBy('dateBooked', 'desc'));
        const querySnapshot = await getDocs(q);
        const passengerList: any[] = [];
        
        querySnapshot.docs.forEach(doc => {
          const d = doc.data();
          if (d.passengers && Array.isArray(d.passengers)) {
            d.passengers.forEach((p: any, index: number) => {
              // Match passenger with seat if seats array exists
              const assignedSeat = d.seats && d.seats[index] ? d.seats[index].seatNumber : 'Unassigned';
              
              passengerList.push({
                id: `${doc.id}-${index}`,
                name: `${p.title || ''} ${p.firstName || ''} ${p.lastName || ''}`.trim(),
                type: 'Adult',
                bookingId: d.bookingId,
                flight: d.flight?.airline?.iata + d.flight?.flight?.number,
                seat: assignedSeat,
                nationality: p.nationality || 'Unknown',
                status: d.status || 'Confirmed'
              });
            });
          }
        });
        
        setData(passengerList);
      } catch (error) {
        console.error("Error fetching passengers:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPassengers();
  }, []);

  if (loading) {
    return <div style={{padding: '24px'}}>Loading passenger manifests...</div>;
  }

  return <AdminTable title="Passenger Manifests" columns={columns} data={data} />;
}

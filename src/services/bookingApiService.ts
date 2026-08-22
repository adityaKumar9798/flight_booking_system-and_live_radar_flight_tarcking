import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function getBookingByPNR({ pnr }: { pnr: string }) {
  try {
    const q = query(collection(db, 'bookings'), where('pnr', '==', pnr));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { error: 'No booking found with this PNR.' };
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    return {
      pnr: data.pnr,
      bookingId: data.bookingId,
      status: data.status,
      dateBooked: data.dateBooked,
      flight: data.flight, // includes airline, flightNumber, departureTime, etc.
      passengers: data.passengers, // array of { firstName, lastName, etc }
      totalPaid: data.totalPaid,
    };
  } catch (error: any) {
    console.error('Error fetching booking by PNR:', error);
    return { error: 'Failed to fetch booking from database.' };
  }
}

export async function getUserBookings({ userId }: { userId: string }) {
  if (!userId) {
    return { error: 'User is not logged in. Cannot fetch user bookings without authentication.' };
  }
  
  try {
    const q = query(collection(db, 'bookings'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { message: 'You have no upcoming or past bookings on record.' };
    }

    const bookings: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        pnr: data.pnr,
        status: data.status,
        dateBooked: data.dateBooked,
        flight: data.flight,
        passengers: data.passengers,
      });
    });
    
    return { bookings };
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    return { error: 'Failed to fetch user bookings from database.' };
  }
}

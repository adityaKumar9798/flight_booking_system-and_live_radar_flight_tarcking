'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function FlightsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<any>(null);
  const [formData, setFormData] = useState({
    flightNo: '', airline: '', departure: '', arrival: '', date: '', status: 'Scheduled'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'flightNo', label: 'Flight No' },
    { key: 'airline', label: 'Airline' },
    { key: 'departure', label: 'Departure' },
    { key: 'arrival', label: 'Arrival' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'custom_flights'));
        const flightsList = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            flightNo: d.flightNo,
            airline: d.airline,
            departure: d.departure,
            arrival: d.arrival,
            date: d.date,
            status: d.status || 'Scheduled'
          };
        });
        
        // Show placeholders if empty
        if (flightsList.length === 0) {
          setData([
             { flightNo: 'VS355', airline: 'Virgin Atlantic', departure: 'BOM (10:30)', arrival: 'LHR (14:45)', date: '19 Aug 2026', status: 'In Air' },
             { flightNo: '6E502', airline: 'IndiGo', departure: 'BLR (06:00)', arrival: 'DXB (08:30)', date: '19 Aug 2026', status: 'Scheduled' }
          ]);
        } else {
          setData(flightsList);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, []);

  const handleOpenAdd = () => {
    setEditingFlight(null);
    setFormData({ flightNo: '', airline: '', departure: '', arrival: '', date: '', status: 'Scheduled' });
    setShowModal(true);
  };

  const handleOpenEdit = (flight: any) => {
    setEditingFlight(flight);
    setFormData({
      flightNo: flight.flightNo,
      airline: flight.airline,
      departure: flight.departure,
      arrival: flight.arrival,
      date: flight.date,
      status: flight.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFlight && editingFlight.id) {
        await updateDoc(doc(db, 'custom_flights', editingFlight.id), formData);
        setData(data.map(f => f.id === editingFlight.id ? { ...f, ...formData } : f));
      } else {
        const docRef = await addDoc(collection(db, 'custom_flights'), formData);
        setData([...data, { id: docRef.id, ...formData }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving flight:", error);
      alert("Failed to save flight. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{padding: '24px'}}>Loading flights...</div>;
  }

  return (
    <>
      <AdminTable 
        title="Flight Schedule" 
        columns={columns} 
        data={data} 
        primaryAction="+ Add Flight" 
        onPrimaryActionClick={handleOpenAdd}
        onEditClick={handleOpenEdit}
      />

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            background: 'white', padding: '24px', borderRadius: '8px', 
            width: '100%', maxWidth: '500px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{marginTop: 0, marginBottom: '20px', color: '#1e293b'}}>
              {editingFlight ? 'Edit Flight' : 'Add New Flight'}
            </h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Flight No</label>
                  <input required value={formData.flightNo} onChange={e => setFormData({...formData, flightNo: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Airline</label>
                  <input required value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Departure</label>
                  <input required value={formData.departure} onChange={e => setFormData({...formData, departure: e.target.value})} placeholder="e.g. BOM (10:30)" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Arrival</label>
                  <input required value={formData.arrival} onChange={e => setFormData({...formData, arrival: e.target.value})} placeholder="e.g. LHR (14:45)" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Date</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} placeholder="e.g. 19 Aug 2026" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Air">In Air</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px'}}>
                <button type="button" onClick={() => setShowModal(false)} style={{padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#475569'}}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>{isSubmitting ? 'Saving...' : 'Save Flight'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

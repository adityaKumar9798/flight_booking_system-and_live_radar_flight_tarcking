'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function AirportsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirport, setEditingAirport] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '', name: '', city: '', country: '', terminals: '', status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'code', label: 'IATA Code' },
    { key: 'name', label: 'Airport Name' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country' },
    { key: 'terminals', label: 'Terminals' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'airports'));
        const airportsList = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            code: d.code,
            name: d.name,
            city: d.city,
            country: d.country,
            terminals: d.terminals,
            status: d.status || 'Active'
          };
        });
        
        if (airportsList.length === 0) {
          setData([
            { code: 'DEL', name: 'Indira Gandhi Int.', city: 'New Delhi', country: 'India', terminals: '3', status: 'Active' },
            { code: 'BOM', name: 'Chhatrapati Shivaji Int.', city: 'Mumbai', country: 'India', terminals: '2', status: 'Active' },
            { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', terminals: '4', status: 'Active' }
          ]);
        } else {
          setData(airportsList);
        }
      } catch (error) {
        console.error("Error fetching airports:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAirports();
  }, []);

  const handleOpenAdd = () => {
    setEditingAirport(null);
    setFormData({ code: '', name: '', city: '', country: '', terminals: '', status: 'Active' });
    setShowModal(true);
  };

  const handleOpenEdit = (airport: any) => {
    setEditingAirport(airport);
    setFormData({
      code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      terminals: airport.terminals,
      status: airport.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAirport && editingAirport.id) {
        await updateDoc(doc(db, 'airports', editingAirport.id), formData);
        setData(data.map(a => a.id === editingAirport.id ? { ...a, ...formData } : a));
      } else {
        const docRef = await addDoc(collection(db, 'airports'), formData);
        setData([...data, { id: docRef.id, ...formData }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving airport:", error);
      alert("Failed to save airport. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{padding: '24px'}}>Loading airports...</div>;
  }

  return (
    <>
      <AdminTable 
        title="Airport Database" 
        columns={columns} 
        data={data} 
        primaryAction="+ Add Airport" 
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
              {editingAirport ? 'Edit Airport' : 'Add New Airport'}
            </h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>IATA Code</label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. LHR" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Airport Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Heathrow Airport" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>City</label>
                  <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Country</label>
                  <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Terminals</label>
                  <input required type="number" value={formData.terminals} onChange={e => setFormData({...formData, terminals: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px'}}>
                <button type="button" onClick={() => setShowModal(false)} style={{padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#475569'}}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>{isSubmitting ? 'Saving...' : 'Save Airport'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

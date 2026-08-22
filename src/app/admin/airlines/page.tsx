'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function AirlinesAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAirline, setEditingAirline] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '', name: '', country: '', fleet: '', status: 'Active'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { key: 'code', label: 'IATA Code' },
    { key: 'name', label: 'Airline Name' },
    { key: 'country', label: 'Country' },
    { key: 'fleet', label: 'Fleet Size' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'airlines'));
        const airlinesList = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            code: d.code,
            name: d.name,
            country: d.country,
            fleet: d.fleet,
            status: d.status || 'Active'
          };
        });
        
        if (airlinesList.length === 0) {
          setData([
            { code: 'VS', name: 'Virgin Atlantic', country: 'United Kingdom', fleet: '41', status: 'Active' },
            { code: '6E', name: 'IndiGo', country: 'India', fleet: '320', status: 'Active' },
            { code: 'AI', name: 'Air India', country: 'India', fleet: '128', status: 'Active' }
          ]);
        } else {
          setData(airlinesList);
        }
      } catch (error) {
        console.error("Error fetching airlines:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAirlines();
  }, []);

  const handleOpenAdd = () => {
    setEditingAirline(null);
    setFormData({ code: '', name: '', country: '', fleet: '', status: 'Active' });
    setShowModal(true);
  };

  const handleOpenEdit = (airline: any) => {
    setEditingAirline(airline);
    setFormData({
      code: airline.code,
      name: airline.name,
      country: airline.country,
      fleet: airline.fleet,
      status: airline.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAirline && editingAirline.id) {
        await updateDoc(doc(db, 'airlines', editingAirline.id), formData);
        setData(data.map(a => a.id === editingAirline.id ? { ...a, ...formData } : a));
      } else {
        const docRef = await addDoc(collection(db, 'airlines'), formData);
        setData([...data, { id: docRef.id, ...formData }]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving airline:", error);
      alert("Failed to save airline. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{padding: '24px'}}>Loading airlines...</div>;
  }

  return (
    <>
      <AdminTable 
        title="Airline Directory" 
        columns={columns} 
        data={data} 
        primaryAction="+ Add Airline" 
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
              {editingAirline ? 'Edit Airline' : 'Add New Airline'}
            </h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>IATA Code</label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. VS" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Airline Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Virgin Atlantic" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Country</label>
                  <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="e.g. United Kingdom" style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
                <div style={{flex: 1}}>
                  <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Fleet Size</label>
                  <input required type="number" value={formData.fleet} onChange={e => setFormData({...formData, fleet: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}} />
                </div>
              </div>
              <div>
                <label style={{display: 'block', fontSize: '14px', marginBottom: '8px', color: '#64748b'}}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '4px'}}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px'}}>
                <button type="button" onClick={() => setShowModal(false)} style={{padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#475569'}}>Cancel</button>
                <button type="submit" disabled={isSubmitting} style={{padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>{isSubmitting ? 'Saving...' : 'Save Airline'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

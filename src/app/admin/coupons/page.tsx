'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export default function CouponsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState('Percentage');
  const [discount, setDiscount] = useState('');
  const [expiry, setExpiry] = useState('');

  const columns = [
    { key: 'code', label: 'Coupon Code' },
    { key: 'type', label: 'Discount Type' },
    { key: 'discount', label: 'Discount' },
    { key: 'expiry', label: 'Expiry Date' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  const fetchCoupons = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'coupons'));
      const couponsList = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          code: d.code,
          type: d.type,
          discount: d.discount,
          expiry: new Date(d.expiry).toLocaleDateString(),
          status: new Date(d.expiry) > new Date() ? 'Active' : 'Expired'
        };
      });
      setData(couponsList);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async () => {
    if (!code || !discount || !expiry) return alert('Please fill all fields');
    try {
      await addDoc(collection(db, 'coupons'), {
        code: code.toUpperCase(),
        type,
        discount,
        expiry,
        createdAt: serverTimestamp()
      });
      alert('Coupon created successfully!');
      setCode('');
      setDiscount('');
      setExpiry('');
      fetchCoupons();
    } catch (err) {
      console.error("Error creating coupon:", err);
      alert('Failed to create coupon');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div style={{background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)'}}>
        <h3 style={{color: 'var(--primary)', marginBottom: '16px'}}>Create New Coupon</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px'}}>
          <input 
            type="text" 
            placeholder="Coupon Code (e.g. AERO20)" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}} 
          />
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}}
          >
            <option>Percentage</option>
            <option>Flat Amount</option>
          </select>
          <input 
            type="text" 
            placeholder="Discount (e.g. 20%)" 
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}} 
          />
          <input 
            type="date" 
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}} 
          />
        </div>
        <button 
          onClick={handleCreateCoupon}
          style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer'}}
        >
          + Create Coupon
        </button>
      </div>
      
      {loading ? (
        <div style={{padding: '24px'}}>Loading active coupons...</div>
      ) : (
        <AdminTable title="Active Coupons" columns={columns} data={data} />
      )}
    </div>
  );
}

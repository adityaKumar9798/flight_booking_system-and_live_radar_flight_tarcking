'use client';

import { useEffect, useState } from 'react';
import AdminTable from '@/components/admin/AdminTable';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export default function NotificationsAdmin() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [type, setType] = useState('Select Type');
  const [message, setMessage] = useState('');

  const columns = [
    { key: 'type', label: 'Notification Type' },
    { key: 'message', label: 'Message' },
    { key: 'recipients', label: 'Recipients' },
    { key: 'date', label: 'Date Sent' },
    { key: 'status', label: 'Status', isBadge: true }
  ];

  const fetchNotifications = async () => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const notifsList = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          type: d.type,
          message: d.message,
          recipients: d.recipients || 'All Users',
          date: d.createdAt ? new Date(d.createdAt.toMillis()).toLocaleDateString() : 'Just Now',
          status: 'Sent'
        };
      });
      setData(notifsList);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSendNotification = async () => {
    if (type === 'Select Type' || !message.trim()) return alert('Please select a type and write a message.');
    
    try {
      await addDoc(collection(db, 'notifications'), {
        type,
        message,
        recipients: type === 'System Alert' ? 'All Admins' : 'All Users',
        createdAt: serverTimestamp()
      });
      alert('Notification sent successfully!');
      setType('Select Type');
      setMessage('');
      fetchNotifications();
    } catch (err) {
      console.error("Error sending notification:", err);
      alert('Failed to send notification');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div style={{background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)'}}>
        <h3 style={{color: 'var(--primary)', marginBottom: '16px'}}>Send New Notification</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px'}}>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}}
          >
            <option disabled>Select Type</option>
            <option>Flight Alert</option>
            <option>Promotion</option>
            <option>System Alert</option>
          </select>
          <textarea 
            placeholder="Write notification message here..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', minHeight: '100px'}}
          ></textarea>
        </div>
        <button 
          onClick={handleSendNotification}
          style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer'}}
        >
          Send Notification
        </button>
      </div>
      
      {loading ? (
        <div style={{padding: '24px'}}>Loading history...</div>
      ) : (
        <AdminTable title="Notification History" columns={columns} data={data} />
      )}
    </div>
  );
}

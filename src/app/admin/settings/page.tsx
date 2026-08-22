'use client';

import { useState } from 'react';

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState('General');
  const tabs = ['General', 'Booking', 'Notifications', 'Security', 'Appearance'];

  return (
    <div style={{background: 'white', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden'}}>
      <div style={{display: 'flex', borderBottom: '1px solid var(--border)', background: '#f8fafc'}}>
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 24px', 
              border: 'none', 
              background: 'none', 
              cursor: 'pointer',
              fontWeight: 600,
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-light)',
              borderBottom: activeTab === tab ? '3px solid var(--primary)' : '3px solid transparent'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div style={{padding: '32px'}}>
        <h2 style={{color: 'var(--primary)', marginBottom: '24px'}}>{activeTab} Settings</h2>
        
        <div style={{maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div>
            <label style={{display: 'block', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '8px'}}>Platform Name</label>
            <input type="text" defaultValue="AeroSky" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}} />
          </div>
          
          <div>
            <label style={{display: 'block', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '8px'}}>Support Email</label>
            <input type="email" defaultValue="support@aerosky.com" style={{width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)'}} />
          </div>

          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border)'}}>
            <div>
              <div style={{fontWeight: 600, color: 'var(--text-dark)'}}>Maintenance Mode</div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>Disable user access during updates</div>
            </div>
            <input type="checkbox" style={{width: '24px', height: '24px'}} />
          </div>

          <button style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, alignSelf: 'flex-start'}}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

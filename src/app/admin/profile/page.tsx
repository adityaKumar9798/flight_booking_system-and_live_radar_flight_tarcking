'use client';

export default function ProfileAdmin() {
  return (
    <div style={{background: 'white', padding: '40px', borderRadius: '12px', border: '1px solid var(--border)', maxWidth: '600px', margin: '0 auto'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px'}}>
        <div style={{width: '100px', height: '100px', background: 'var(--primary)', color: 'var(--secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold'}}>
          A
        </div>
        <div>
          <h1 style={{color: 'var(--primary)', marginBottom: '4px'}}>Admin User</h1>
          <p style={{color: 'var(--text-light)', marginBottom: '8px'}}>Super Admin</p>
          <span style={{background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700}}>Active Account</span>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <div>
          <label style={{display: 'block', color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px'}}>Email Address</label>
          <div style={{padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border)'}}>admin@aerosky.com</div>
        </div>
        <div>
          <label style={{display: 'block', color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px'}}>Last Login</label>
          <div style={{padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border)'}}>August 19, 2026 - 09:14 AM (IP: 192.168.1.1)</div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '16px', marginTop: '32px'}}>
        <button style={{flex: 1, background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Edit Profile</button>
        <button style={{flex: 1, background: 'white', color: 'var(--text-dark)', border: '1px solid var(--border)', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600}}>Security Settings</button>
      </div>
    </div>
  );
}

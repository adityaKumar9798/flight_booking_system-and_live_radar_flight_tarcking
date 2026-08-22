'use client';

export default function AnalyticsAdmin() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1 style={{color: 'var(--primary)'}}>Analytics & Reports</h1>
        <div style={{display: 'flex', gap: '12px'}}>
          <select style={{padding: '8px 16px', borderRadius: '6px', border: '1px solid var(--border)'}}>
            <option>Today</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>3 Months</option>
            <option>1 Year</option>
          </select>
          <button style={{background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer'}}>Export Report</button>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        <div style={{background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '300px'}}>
          <h3 style={{color: 'var(--text-dark)', marginBottom: '16px'}}>Revenue Performance</h3>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '16px', borderBottom: '1px solid var(--border)'}}>
            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
              <div key={i} style={{width: '30px', height: `${h}%`, background: 'var(--primary)', borderRadius: '4px 4px 0 0'}}></div>
            ))}
          </div>
        </div>

        <div style={{background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', minHeight: '300px'}}>
          <h3 style={{color: 'var(--text-dark)', marginBottom: '16px'}}>Booking Channels</h3>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', paddingBottom: '16px', borderBottom: '1px solid var(--border)'}}>
             {[80, 20].map((h, i) => (
              <div key={i} style={{width: '60px', height: `${h}%`, background: i === 0 ? 'var(--primary)' : 'var(--secondary)', borderRadius: '4px 4px 0 0'}}></div>
            ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-light)'}}>
            <span>Web (80%)</span>
            <span>App (20%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

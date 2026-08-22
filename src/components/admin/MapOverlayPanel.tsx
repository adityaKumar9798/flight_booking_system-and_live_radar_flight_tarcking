'use client';

import React from 'react';
import { Users, ChevronUp, PlaneTakeoff, PlaneLanding, HelpCircle } from 'lucide-react';
import styles from './MapOverlay.module.css';

export default function MapOverlayPanel() {
  const trackedFlights = [
    { rank: 1, name: 'NATO43', type: 'E3TF', route: 'Geilenkirchen GKE - N/A', viewers: '2,712' },
    { rank: 2, name: 'NATO01', type: 'E3TF', route: 'Geilenkirchen GKE - N/A', viewers: '1,718' },
    { rank: 3, name: 'CPA2068', type: 'B748', code: 'CX2068', route: 'Frankfurt FRA - Hong Kong HKG', viewers: '1,228' },
    { rank: 4, name: 'SVF664', type: 'GLEX', code: 'SVF664', route: 'Stockholm ARN - N/A', viewers: '1,040' },
  ];

  const disruptions = [
    { name: 'Tel Aviv', code: 'TLV', temp: '31°C', wind: '280° 10 kts', arr: 5.0, dep: 4.4, status: 'red' },
    { name: 'Florence', code: 'FLR', temp: '26°C', wind: '120° 6 kts', arr: 2.7, dep: 5.0, status: 'mixed' },
    { name: 'Milan', code: 'BGY', temp: '19°C', wind: '300° 6 kts', arr: 3.4, dep: 4.1, status: 'mixed' },
    { name: 'Venice', code: 'VCE', temp: '22°C', wind: '100° 5 kts', arr: 2.7, dep: 3.1, status: 'yellow' },
  ];

  return (
    <div className={styles.overlayContainer}>
      
      {/* Most Tracked Flights Panel */}
      <div className={styles.panel}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Most tracked flights <span className={styles.liveBadge}>LIVE</span>
            <HelpCircle size={14} color="#737373" style={{ marginLeft: '8px' }} />
          </div>
          <ChevronUp size={18} color="#a3a3a3" />
        </div>
        <div className={styles.list}>
          {trackedFlights.map((f, i) => (
            <div key={i} className={styles.listItem}>
              <div className={styles.rowBetween}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={styles.flightTitle}>{f.rank}. {f.name}</span>
                  {f.code && <span className={styles.airportCode}>{f.code}</span>}
                  <span className={styles.badge}>{f.type}</span>
                </div>
                <div className={styles.viewers}>
                  {f.viewers} <Users size={14} />
                </div>
              </div>
              <div className={styles.route}>
                {f.route.split(' - ').map((part, idx, arr) => {
                  const hasCode = part.includes(' ');
                  if (!hasCode) return <span key={idx}>{part}{idx === 0 && ' - '}</span>;
                  const [city, code] = part.split(' ');
                  return (
                    <span key={idx}>
                      {city} <span className={styles.airportCode}>{code}</span>
                      {idx === 0 && ' - '}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Airport Disruptions Panel */}
      <div className={styles.panel}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Airport disruptions <span className={styles.liveBadge}>LIVE</span>
            <HelpCircle size={14} color="#737373" style={{ marginLeft: '8px' }} />
          </div>
          <ChevronUp size={18} color="#a3a3a3" />
        </div>
        <div className={styles.list}>
          {disruptions.map((d, i) => (
            <div key={i} className={styles.listItem} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className={styles.flightTitle}>{d.name}</span>
                  <span className={styles.airportCode}>{d.code}</span>
                </div>
                <div className={styles.weatherRow}>
                  <span>🌤 {d.temp}</span>
                  <span>↗ {d.wind}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                <div className={styles.disruptionScore}>
                  <PlaneLanding size={14} color="#a3a3a3" />
                  <div className={d.status === 'red' || d.status === 'mixed' ? styles.dotRed : styles.dotYellow} />
                  {d.arr.toFixed(1)}
                </div>
                <div className={styles.disruptionScore}>
                  <PlaneTakeoff size={14} color="#a3a3a3" />
                  <div className={d.status === 'red' ? styles.dotRed : (d.status === 'mixed' && d.dep > 4 ? styles.dotRed : styles.dotYellow)} />
                  {d.dep.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.disruptionFooter}>
          Disruption map
        </div>
      </div>

    </div>
  );
}

// components/dashboard-stats.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;

const statMeta: Record<string, { color: string; icon: React.ReactNode }> = {
  'Total Schools': { color: '#0E9384', icon: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></> },
  'Total Students': { color: '#3E9AE0', icon: <><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></> },
  'Total Parents': { color: '#F1785F', icon: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="m22 11-3 3-1.5-1.5" /></> },
  'Assessments': { color: '#9B5DE5', icon: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></> },
};
const metaFor = (t: string) => statMeta[t] || statMeta['Total Schools'];

export function DashboardStats() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <div className="ng-grid-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22, height: 96 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="ng-grid-4">
      {Object.entries(stats).map(([key, value]) => (
        <StatCard key={key} title={key.replace(/([A-Z])/g, ' $1').trim()} value={value} />
      ))}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  const m = metaFor(title);
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, background: tint(m.color), color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico>{m.icon}</Ico></span>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{(value ?? 0).toLocaleString()}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{title}</div>
        </div>
      </div>
    </div>
  );
}

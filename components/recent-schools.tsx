// components/recent-schools.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  createdAt: string;
}

export const RecentSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get('/api/admin/recent-schools');
        setSchools(response.data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;

  return (
    <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: '1px solid var(--border-c)' }}>
        <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Ico size={18}><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></Ico>
        </span>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Recently Added Schools</h2>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr>
              {['Name', 'Location', 'Created'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 22px', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em', background: 'var(--canvas)', borderBottom: '1px solid var(--border-c)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schools.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '22px', color: 'var(--muted)' }}>No schools yet.</td></tr>
            )}
            {schools.map((school, i) => (
              <tr key={school.id} style={{ borderBottom: i !== schools.length - 1 ? '1px solid var(--border-c)' : 'none' }}>
                <td style={{ padding: '14px 22px', fontWeight: 600, color: 'var(--ink)' }}>{school.name}</td>
                <td style={{ padding: '14px 22px', color: 'var(--muted)' }}>{school.city}, {school.state}</td>
                <td style={{ padding: '14px 22px', color: 'var(--muted)' }}>{new Date(school.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

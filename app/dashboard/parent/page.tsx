'use client'
import React, { useState, useEffect } from 'react';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;
const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };

function StatTile({ value, label, color, icon }: { value: number; label: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 14, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: 11, background: tint(color), color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
        <div>
          <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>{label}</div>
        </div>
      </div>
    </div>
  );
}

const ChildCard = ({ child }) => {
  const total = child.stats.totalAssessments || 0;
  const completed = child.stats.completedAssessments || 0;
  const pending = child.stats.pendingAssessments || 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Ico size={22}><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></Ico>
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{child.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Grade {child.grade}{child.school ? ` · ${child.school}` : ''}</div>
        </div>
      </div>

      {/* progress */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Assessment progress</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{pct}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: 'var(--tint)', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--pri)', borderRadius: 999 }} />
        </div>
      </div>

      {/* mini stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
        {[
          { label: 'Total', value: total, color: '#0E9384' },
          { label: 'Completed', value: completed, color: '#1F8A5B' },
          { label: 'Pending', value: pending, color: '#2F6FB0' },
        ].map((m) => (
          <div key={m.label} style={{ background: 'var(--canvas)', border: '1px solid var(--border-c)', borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 19, fontWeight: 600, color: m.color, letterSpacing: '-0.02em' }}>{m.value}</div>
            <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 3 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/parent/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;
  if (error) return <div style={{ color: '#C0453B', padding: 8 }}>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      {/* header */}
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Welcome, {data.parent.name}</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>
          {data.parent.phone ? data.parent.phone : 'Track your children’s assessment progress'}
        </p>
      </div>

      {/* stat tiles */}
      <div className="ng-grid-4" style={{ marginTop: 24 }}>
        <StatTile value={data.stats.totalChildren} label="Children" color="#9B5DE5" icon={<Ico><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ico>} />
        <StatTile value={data.stats.totalAssessments} label="Total assessments" color="#0E9384" icon={<Ico><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Ico>} />
        <StatTile value={data.stats.completedAssessments} label="Completed" color="#1F8A5B" icon={<Ico><path d="M20 6 9 17l-5-5" /></Ico>} />
        <StatTile value={data.stats.schoolsCount} label="Schools" color="#3E9AE0" icon={<Ico><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></Ico>} />
      </div>

      {/* children */}
      <div style={{ marginTop: 28, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
          <Ico size={17}><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></Ico>
        </span>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>Children’s progress</h2>
      </div>

      {data.children.length === 0 ? (
        <div style={{ ...card, color: 'var(--muted)', fontSize: 13.5 }}>No children linked yet.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }} className="ng-dash-cols">
          {data.children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const typeMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PERSONALITY: { label: 'Personality', color: '#9B5DE5', icon: <><path d="M12 5a3 3 0 0 0-6 .2 3 3 0 0 0-1.7 5.2A2.8 2.8 0 0 0 6 16a3 3 0 0 0 6 .5z" /><path d="M12 5a3 3 0 0 1 6 .2 3 3 0 0 1 1.7 5.2A2.8 2.8 0 0 1 18 16a3 3 0 0 1-6 .5z" /></> },
  APTITUDE: { label: 'Aptitude', color: '#0E9384', icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></> },
  INTEREST: { label: 'Interest', color: '#F1785F', icon: <path d="M12 3l2.4 5.9 6.3.5-4.8 4.1 1.5 6.2L12 16.9 6.6 19.7l1.5-6.2L3.3 9.4l6.3-.5z" /> },
  LEARNING_STYLE: { label: 'Learning style', color: '#3E9AE0', icon: <><path d="M12 7v14" /><path d="M3 5h5a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2H3z" /><path d="M21 5h-5a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2H21z" /></> },
};
const metaFor = (t: string) => typeMeta[t] || typeMeta.APTITUDE;

const statusMeta: Record<string, { label: string; fg: string }> = {
  COMPLETED: { label: 'Completed', fg: '#1F8A5B' },
  IN_PROGRESS: { label: 'In progress', fg: '#B4791F' },
  PENDING: { label: 'Pending', fg: '#2F6FB0' },
  EXPIRED: { label: 'Expired', fg: '#C0453B' },
};
const chip = (fg: string): React.CSSProperties => ({ fontSize: 11.5, fontWeight: 600, color: fg, background: `color-mix(in srgb, ${fg} 13%, transparent)`, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' });
const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;

const AX = [[0, -1], [0.95106, -0.30902], [0.58779, 0.80902], [-0.58779, 0.80902], [-0.95106, -0.30902]];
function radarPoints(vals: number[]) {
  return vals.map((v, i) => `${(110 + AX[i][0] * 78 * v).toFixed(1)},${(105 + AX[i][1] * 78 * v).toFixed(1)}`).join(' ');
}

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

export default function StudentDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/students/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        setStats(await res.json());
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;
  if (error) return <div style={{ color: '#C0453B', padding: 8 }}>Error: {error}</div>;
  if (!stats) return null;

  const s = stats.assessmentStats || { total: 0, pending: 0, inProgress: 0, completed: 0 };
  const details: any[] = stats.assessmentDetails || [];
  const cog = stats.latestReport?.data?.cognitiveProfile;
  const radar = cog
    ? radarPoints([cog.analyticalThinking, cog.verbalComprehension, cog.spatialVisualization, cog.memoryRecall, cog.problemSolving].map((n: number) => (n || 0) / 100))
    : null;
  const parent = stats.parentInfo?.[0];

  return (
    <div>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Welcome, {stats.student?.name}</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>
            Grade {stats.student?.grade}{stats.schoolInfo?.name ? ` · ${stats.schoolInfo.name}` : ''}
          </p>
        </div>
        <button onClick={() => router.push('/dashboard/student/assignments')} className="ng-btn-primary" style={{ height: 42, padding: '0 18px', background: 'var(--pri)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}>
          <Ico size={16}><path d="m5 3 14 9-14 9V3z" /></Ico>
          Go to assignments
        </button>
      </div>

      {/* stat tiles */}
      <div className="ng-grid-4" style={{ marginTop: 24 }}>
        <StatTile value={s.total} label="Assessments" color="#0E9384" icon={<Ico><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></Ico>} />
        <StatTile value={s.pending} label="Pending" color="#2F6FB0" icon={<Ico><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>} />
        <StatTile value={s.inProgress} label="In progress" color="#B4791F" icon={<Ico><path d="m5 3 14 9-14 9V3z" /></Ico>} />
        <StatTile value={s.completed} label="Completed" color="#1F8A5B" icon={<Ico><path d="M20 6 9 17l-5-5" /></Ico>} />
      </div>

      {/* two column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginTop: 20, alignItems: 'start' }} className="ng-dash-cols">
        {/* assessments list */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Your assessments</h2>
            <button onClick={() => router.push('/dashboard/student/assignments')} style={{ background: 'none', border: 'none', color: 'var(--pri)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>View all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 6 }}>
            {details.length === 0 && <p style={{ fontSize: 13.5, color: 'var(--muted)', padding: '14px 0' }}>No assessments assigned yet.</p>}
            {details.map((a, i) => {
              const m = metaFor(a.type);
              const st = statusMeta[a.status] || statusMeta.PENDING;
              const done = a.status === 'COMPLETED';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i !== details.length - 1 ? '1px solid var(--border-c)' : 'none' }}>
                  <span style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tint(m.color), color: m.color }}><Ico size={20}>{m.icon}</Ico></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>{a.title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{m.label}</div>
                  </div>
                  <span style={chip(st.fg)}>{st.label}</span>
                  <button onClick={() => router.push(done ? '/dashboard/student/reports' : '/dashboard/student/assignments')} style={{ height: 32, padding: '0 13px', borderRadius: 8, border: '1px solid var(--border-c)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }} className="ng-btn-soft">
                    {done ? 'Review' : a.status === 'IN_PROGRESS' ? 'Continue' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...card, padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>Cognitive snapshot</h2>
            {radar ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
                <svg width="220" height="205" viewBox="0 0 220 205">
                  {['110,27 184.2,80.9 155.9,168.1 64.1,168.1 35.8,80.9', '110,53.5 159,89.1 140.3,146.7 79.7,146.7 61,89.1', '110,79.3 134.4,97.1 125.1,125.8 94.9,125.8 85.6,97.1'].map((p, i) => <polygon key={i} points={p} fill="none" stroke="var(--border-c)" />)}
                  {[[110, 27], [184.2, 80.9], [155.9, 168.1], [64.1, 168.1], [35.8, 80.9]].map(([x, y], i) => <line key={i} x1="110" y1="105" x2={x} y2={y} stroke="var(--border-c)" />)}
                  <polygon points={radar} fill="var(--pri)" fillOpacity="0.15" stroke="var(--pri)" strokeWidth="2" strokeLinejoin="round" />
                  <text x="110" y="18" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Logic</text>
                  <text x="192" y="82" textAnchor="start" fontSize="10.5" fill="var(--muted)">Verbal</text>
                  <text x="156" y="185" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Spatial</text>
                  <text x="64" y="185" textAnchor="middle" fontSize="10.5" fill="var(--muted)">Memory</text>
                  <text x="28" y="82" textAnchor="end" fontSize="10.5" fill="var(--muted)">Focus</text>
                </svg>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '10px 0 0', lineHeight: 1.6 }}>Complete an assessment to see your cognitive profile here.</p>
            )}
          </div>

          <div style={{ ...card, padding: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: '0 0 14px' }}>Your circle</h2>
            {stats.schoolInfo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico size={18}><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></Ico></span>
                <div><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{stats.schoolInfo.name}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>{stats.schoolInfo.city}, {stats.schoolInfo.state}</div></div>
              </div>
            )}
            {parent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: tint('#F1785F'), color: '#F1785F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico size={18}><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></Ico></span>
                <div><div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{parent.firstName} {parent.lastName}</div><div style={{ fontSize: 12, color: 'var(--muted)' }}>Parent{parent.phone ? ` · ${parent.phone}` : ''}</div></div>
              </div>
            )}
            {!stats.schoolInfo && !parent && <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>No linked school or parent yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

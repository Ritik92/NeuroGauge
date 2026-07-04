'use client';
import React from 'react';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;
const chip = (fg: string): React.CSSProperties => ({ fontSize: 11.5, fontWeight: 600, color: fg, background: `color-mix(in srgb, ${fg} 13%, transparent)`, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' });
const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const inputStyle: React.CSSProperties = { height: 40, padding: '0 14px', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 10, fontSize: 14, color: 'var(--ink)', outline: 'none' };

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
  type: string;
  studentCount: number;
  adminFirstName: string;
  adminLastName: string;
  email: string;
  phone: string;
  user: {
    email: string;
  }
}

async function getSchools() {
  const response = await fetch('/api/schools');
  const data = await response.json();
  return data as School[];
}

export default function SchoolsPage() {
  const [schools, setSchools] = React.useState<School[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [stateFilter, setStateFilter] = React.useState('ALL');

  React.useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await getSchools();
        console.log(data);
        setSchools(data);
      } catch (error) {
        console.error('Error fetching schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = stateFilter === 'ALL' || school.state === stateFilter;
    return matchesSearch && matchesState;
  });

  const states = [...new Set(schools.map(school => school.state))];

  if (loading) {
    return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Schools Directory</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Browse and search every registered school on the platform.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
            <Ico size={16}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>
          </span>
          <input
            className="ng-input"
            placeholder="Search schools by name or city..."
            style={{ ...inputStyle, width: '100%', paddingLeft: 38 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="ng-input"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          style={{ ...inputStyle, width: 180, cursor: 'pointer' }}
        >
          <option value="ALL">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {filteredSchools.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: 14 }}>
          No schools found matching your criteria
        </div>
      ) : (
        <div className="ng-grid-3" style={{ marginTop: 20 }}>
          {filteredSchools.map((school) => (
            <div key={school.id} style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={chip('#0E9384')}>{school.type}</span>
                <span style={chip('#3E9AE0')}>{school.studentCount} Students</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
                <span style={{ width: 40, height: 40, flex: '0 0 auto', borderRadius: 11, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico size={20}><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></Ico>
                </span>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{school.name}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
                  <Ico size={16}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Ico>
                  <span>{school.city}, {school.state}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
                  <Ico size={16}><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></Ico>
                  <span>{school.adminFirstName} {school.adminLastName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
                  <Ico size={16}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></Ico>
                  <a href={`mailto:${school.user.email}`} style={{ color: 'var(--muted)', textDecoration: 'none' }} className="ng-link">{school.user.email}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--muted)' }}>
                  <Ico size={16}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></Ico>
                  <a href={`tel:${school.phone}`} style={{ color: 'var(--muted)', textDecoration: 'none' }} className="ng-link">{school.phone}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

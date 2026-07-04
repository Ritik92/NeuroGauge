'use client'
import React from 'react';
import { getSchoolReports } from '@/lib/actions/getSchoolReports';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;
const chip = (fg: string): React.CSSProperties => ({ fontSize: 11.5, fontWeight: 600, color: fg, background: `color-mix(in srgb, ${fg} 13%, transparent)`, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' });
const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const inputStyle: React.CSSProperties = { height: 40, padding: '0 14px', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 10, fontSize: 14, color: 'var(--ink)', outline: 'none' };

interface SchoolReport {
  id: string;
  type: 'CLASS_WISE' | 'GRADE_WISE' | 'SCHOOL_WIDE' | 'YEARLY';
  createdAt: string;
  school: {
    name: string;
    city: string;
    state: string;
    adminFirstName: string;
    adminLastName: string;
    phone: string;
  };
}

const typeMeta: Record<string, { color: string; icon: React.ReactNode }> = {
  CLASS_WISE: { color: '#0E9384', icon: <><path d="M3 3v18h18" /><rect x="7" y="10" width="3" height="7" /><rect x="12" y="6" width="3" height="11" /><rect x="17" y="13" width="3" height="4" /></> },
  GRADE_WISE: { color: '#9B5DE5', icon: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></> },
  SCHOOL_WIDE: { color: '#3E9AE0', icon: <><path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" /></> },
  YEARLY: { color: '#E8A33D', icon: <><path d="M22 7 13.5 15.5 8.5 10.5 2 17" /><path d="M16 7h6v6" /></> },
};
const metaFor = (t: string) => typeMeta[t] || typeMeta.SCHOOL_WIDE;

export default function SchoolReportList() {
  const [initialReports, setInitialReports] = React.useState<SchoolReport[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getSchoolReports();
        //@ts-ignore
        setInitialReports(response);
      } catch (error) {
        console.error('Error fetching school reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = initialReports?.filter(report => {
    const matchesSearch = report.school.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || report.type === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>School Reports</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Generated reports across schools, grades, and classes.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
            <Ico size={16}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>
          </span>
          <input
            className="ng-input"
            placeholder="Search by school name..."
            style={{ ...inputStyle, width: '100%', paddingLeft: 38 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="ng-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ ...inputStyle, width: 180, cursor: 'pointer' }}
        >
          <option value="ALL">All Types</option>
          <option value="CLASS_WISE">Class-wise</option>
          <option value="GRADE_WISE">Grade-wise</option>
          <option value="SCHOOL_WIDE">School-wide</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      <div className="ng-grid-3" style={{ marginTop: 20 }}>
        {filteredReports.map((report) => {
          const m = metaFor(report.type);
          return (
            <div key={report.id} style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: 10, background: tint(m.color), color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ico size={20}>{m.icon}</Ico>
                  </span>
                  <span style={chip(m.color)}>{report.type.replace('_', ' ')}</span>
                </div>
                <span style={chip('#5E6B6A')}>{formatDate(report.createdAt)}</span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: 16, letterSpacing: '-0.01em' }}>{report.school.name}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0' }}>{report.school.city}, {report.school.state}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-c)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Admin</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{report.school.adminFirstName} {report.school.adminLastName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--muted)' }}>Contact</span>
                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{report.school.phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: 14 }}>
          No reports found matching your criteria.
        </div>
      )}
    </div>
  );
}

'use client'
import React from 'react';
import { getAssessments } from '@/lib/actions/fetchassessment';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;
const chip = (fg: string): React.CSSProperties => ({ fontSize: 11.5, fontWeight: 600, color: fg, background: `color-mix(in srgb, ${fg} 13%, transparent)`, padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' });
const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const inputStyle: React.CSSProperties = { height: 40, padding: '0 14px', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 10, fontSize: 14, color: 'var(--ink)', outline: 'none' };

const typeMeta: Record<string, { color: string; icon: React.ReactNode }> = {
  PERSONALITY: { color: '#9B5DE5', icon: <><path d="M12 5a3 3 0 0 0-6 .2 3 3 0 0 0-1.7 5.2A2.8 2.8 0 0 0 6 16a3 3 0 0 0 6 .5z" /><path d="M12 5a3 3 0 0 1 6 .2 3 3 0 0 1 1.7 5.2A2.8 2.8 0 0 1 18 16a3 3 0 0 1-6 .5z" /></> },
  APTITUDE: { color: '#0E9384', icon: <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></> },
  INTEREST: { color: '#F1785F', icon: <path d="M12 3l2.4 5.9 6.3.5-4.8 4.1 1.5 6.2L12 16.9 6.6 19.7l1.5-6.2L3.3 9.4l6.3-.5z" /> },
  LEARNING_STYLE: { color: '#3E9AE0', icon: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></> },
};
const metaFor = (t: string) => typeMeta[t] || typeMeta.APTITUDE;

const statusColors: Record<string, string> = {
  DRAFT: '#E8A33D',
  PUBLISHED: '#1F8A5B',
  ARCHIVED: '#5E6B6A',
};

const AssessmentList = () => {
  const [assessments, setAssessments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await getAssessments();
        const data = await response;
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || assessment.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div style={{ color: 'var(--muted)', padding: 8 }}>Loading…</div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Assessments</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>The catalog of assessments available across the platform.</p>

      <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
            <Ico size={16}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></Ico>
          </span>
          <input
            className="ng-input"
            placeholder="Search assessments..."
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
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      <div className="ng-grid-3" style={{ marginTop: 20 }}>
        {filteredAssessments.map((assessment) => {
          const m = metaFor(assessment.type);
          const sc = statusColors[assessment.status] || '#5E6B6A';
          return (
            <div key={assessment.id} style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 38, height: 38, flex: '0 0 auto', borderRadius: 10, background: tint(m.color), color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Ico size={20}>{m.icon}</Ico>
                  </span>
                  <span style={chip(m.color)}>{assessment.type}</span>
                </div>
                <span style={chip(sc)}>{assessment.status}</span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: 16, letterSpacing: '-0.01em' }}>{assessment.title}</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '6px 0 0', lineHeight: 1.55 }}>{assessment.description}</p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                {assessment.gradeLevel.map((grade) => (
                  <span key={grade} style={chip('#3E9AE0')}>Grade {grade}</span>
                ))}
              </div>

              <button className="ng-btn-primary" style={{ marginTop: 18, height: 40, width: '100%', background: 'var(--pri)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)', fontSize: 14 }}>
          No assessments found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default AssessmentList;

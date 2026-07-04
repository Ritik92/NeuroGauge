// components/school-reports.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SchoolReport {
  id: string;
  type: 'GRADE_WISE' | 'YEARLY';
  data: any;
  createdAt: string;
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const th: React.CSSProperties = { textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', padding: '11px 16px', textTransform: 'uppercase', letterSpacing: '0.03em' };
const td: React.CSSProperties = { fontSize: 13.5, color: 'var(--ink)', padding: '13px 16px' };

export function SchoolReports({ schoolId }: { schoolId: string }) {
  const [reports, setReports] = useState<SchoolReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`/api/schools/${schoolId}/reports`);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [schoolId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 200, borderRadius: 16, background: 'color-mix(in srgb, var(--muted) 12%, transparent)', animation: 'ng-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 200, borderRadius: 16, background: 'color-mix(in srgb, var(--muted) 12%, transparent)', animation: 'ng-pulse 1.4s ease-in-out infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {reports.map((report) => (
        <div key={report.id} style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 16px' }}>
            {report.type === 'GRADE_WISE' ? 'Grade-wise Report' : 'Yearly Report'}
          </h2>
          {report.type === 'GRADE_WISE' ? (
            <GradeWiseReport data={report.data} />
          ) : (
            <YearlyReport data={report.data} />
          )}
        </div>
      ))}
    </div>
  );
}

function GradeWiseReport({ data }: { data: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="ng-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <StatCard label="Total Students" value={data.totalStudents} color="#0E9384" />
        <StatCard label="Math Average" value={data.averageScores.math} color="#3E9AE0" />
        <StatCard label="Science Average" value={data.averageScores.science} color="#F1785F" />
      </div>
      <div style={{ border: '1px solid var(--border-c)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--border-c)' }}>
              <th style={th}>Subject</th>
              <th style={{ ...th, textAlign: 'right' }}>Average Score</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(data.averageScores).map(([subject, score], i) => (
              <tr key={subject} style={{ borderTop: i !== 0 ? '1px solid var(--border-c)' : 'none' }}>
                <td style={{ ...td, fontWeight: 600, textTransform: 'capitalize' }}>{subject}</td>
                <td style={{ ...td, textAlign: 'right' }}>{score as number}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function YearlyReport({ data }: { data: any }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <StatCard label="Graduation Rate" value={`${data.graduationRate}%`} color="#0E9384" />
      <StatCard label="College Acceptance" value={`${data.collegeAcceptance}%`} color="#9B5DE5" />
    </div>
  );
}

function StatCard({ label, value, color = '#0E9384' }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 14, padding: 18 }}>
      <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color, letterSpacing: '-0.02em', marginTop: 4 }}>{value}</div>
    </div>
  );
}

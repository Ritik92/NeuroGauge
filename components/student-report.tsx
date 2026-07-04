'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStudentReports } from '@/lib/actions/report';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);
const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`;

export function ReportList() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getStudentReports();
      setReports((res as any) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <ReportSkeleton />;

  if (!reports.length) {
    return (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
        No reports yet — complete an assessment to generate your first report.
      </div>
    );
  }

  return (
    <div className="ng-grid-3">
      {reports.map((report, index) => {
        const data = report.data || {};
        const label = data?.studentInfo?.personalityType || 'Assessment report';
        const career = data?.bestCareer?.title;
        return (
          <Link key={report.id} href={`/dashboard/student/reports/${report.id}`} className="ng-lift" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22, textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico>{<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></>}</Ico></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Report #{index + 1}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', margin: '16px 0 0', lineHeight: 1.5 }}>
              <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{label}</span>
              {career ? <> · best fit: {career}</> : null}
            </div>
            <div style={{ marginTop: 18, height: 40, borderRadius: 10, background: 'var(--pri)', color: '#fff', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              View report
              <Ico size={16}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Ico>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div className="ng-grid-3">
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--tint)' }} />
            <div style={{ flex: 1 }}>
              <div style={{ width: '60%', height: 12, borderRadius: 6, background: 'var(--border-c)' }} />
              <div style={{ width: '40%', height: 10, borderRadius: 6, background: 'var(--border-c)', marginTop: 8 }} />
            </div>
          </div>
          <div style={{ height: 40, borderRadius: 10, background: 'var(--border-c)', marginTop: 24 }} />
        </div>
      ))}
    </div>
  );
}

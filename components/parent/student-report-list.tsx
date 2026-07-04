'use client';
import React, { useEffect, useState } from 'react';
import { getStudentReportsForParent } from '@/lib/actions/parent';
import Link from 'next/link';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

interface Report {
  id: string;
  createdAt: string;
}

export function StudentReportList({ studentId }: { studentId: string }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      const res = await getStudentReportsForParent(studentId);
      //@ts-ignore
      setReports(res || []);
      setLoading(false);
    };
    loadReports();
  }, [studentId]);

  if (loading) return <ReportSkeleton />;

  if (reports.length === 0) {
    return <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>No reports available yet.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {reports.map((report, i) => (
        <div key={report.id} className="ng-lift" style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 14, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: 'color-mix(in srgb, #3E9AE0 13%, transparent)', color: '#3E9AE0', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <Ico size={19}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></Ico>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Report #{i + 1}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <Link
            href={`/dashboard/parent/reports/${report.id}`}
            className="ng-btn-primary"
            style={{ height: 38, background: 'var(--pri)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textDecoration: 'none' }}
          >
            View details
            <Ico size={15}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Ico>
          </Link>
        </div>
      ))}
    </div>
  );
}

function ReportSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ height: 132, borderRadius: 14, background: 'var(--tint)', opacity: 0.6, animation: 'ng-pulse 1.4s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

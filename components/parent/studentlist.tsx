'use client';
import React, { useEffect, useState } from 'react';
import { getParentStudents } from '@/lib/actions/parent';
import { StudentReportList } from './student-report-list';

const Ico = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: number;
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16 };

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    const loadStudents = async () => {
      const res = await getParentStudents();
      setStudents(res || []);
      setLoading(false);
    };
    loadStudents();
  }, []);

  if (loading) return <StudentsListSkeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {students.map((student) => {
        const open = expandedStudent === student.id;
        return (
          <div key={student.id} style={card}>
            <div
              onClick={() => setExpandedStudent(open ? null : student.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 20, cursor: 'pointer' }}
            >
              <span style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <Ico size={22}><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></Ico>
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{student.firstName} {student.lastName}</div>
                <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>Grade {student.grade}</div>
              </div>
              <span style={{ color: 'var(--muted)', display: 'flex', transition: 'transform 0.18s ease', transform: open ? 'rotate(180deg)' : 'none' }}>
                <Ico size={18}><path d="m6 9 6 6 6-6" /></Ico>
              </span>
            </div>
            {open && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-c)' }}>
                <div style={{ paddingTop: 18 }}>
                  <StudentReportList studentId={student.id} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StudentsListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[...Array(2)].map((_, i) => (
        <div key={i} style={{ height: 82, borderRadius: 16, background: 'var(--tint)', opacity: 0.6, animation: 'ng-pulse 1.4s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

import { ReportList } from '@/components/student-report';

export default function ReportsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Reports</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Your personalized assessment reports.</p>
      <div style={{ marginTop: 24 }}>
        <ReportList />
      </div>
    </div>
  );
}

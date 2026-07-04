// app/dashboard/page.tsx

import { DashboardStats } from '@/components/dashboard-state';
import { RecentSchools } from '@/components/recent-schools';

import { SchoolDistributionChart } from '@/components/school-chart';

export default function DashboardPage() {
  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Dashboard</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Overview of schools, students, and assessments across the platform.</p>

      <div style={{ marginTop: 24 }}>
        <DashboardStats />
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SchoolDistributionChart />
      </div> */}

      <div style={{ marginTop: 20 }}>
        <RecentSchools />
      </div>
    </div>
  );
}

// app/dashboard/page.tsx

import { DashboardStats } from '@/components/dashboard-state';
import { RecentSchools } from '@/components/recent-schools';

import { SchoolDistributionChart } from '@/components/school-chart';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardStats />
      
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SchoolDistributionChart />
      </div> */}

      <RecentSchools />
    </div>
  );
}
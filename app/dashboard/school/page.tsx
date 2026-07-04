import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { SchoolCard, StatsCard } from '@/components/SchoolCard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (user?.role !== 'SCHOOL_ADMIN') {
    redirect('/auth');
  }

  const school = await prisma.school.findUnique({
    where: { userId: user.id },
    include: {
      _count: {
        select: {
          students: true,
          reports: true,
        },
      },
    },
  });

  if (!school) {
    return (
      <div style={{ fontSize: 14, color: 'var(--muted)', padding: 8 }}>
        No school profile found for this account.
      </div>
    );
  }

  const studentsCount = school._count?.students ?? 0;
  const reportsCount = school._count?.reports ?? 0;

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>School dashboard</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Profile and enrolment overview for {school.name}</p>

      <div
        className="ng-dash-cols"
        style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20, marginTop: 24, alignItems: 'start' }}
      >
        <SchoolCard school={school} />
        <StatsCard
          studentsCount={studentsCount}
          reportsCount={reportsCount}
          phone={school.phone}
          established={school.createdAt}
        />
      </div>
    </div>
  );
}

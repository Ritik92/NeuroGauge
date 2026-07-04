import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import AppShell from '@/components/AppShell';

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string } | undefined;

  let schoolId: string | undefined;
  if (user?.role === 'SCHOOL_ADMIN' && user.id) {
    const school = await prisma.school.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    schoolId = school?.id;
  }

  return (
    <AppShell role="SCHOOL_ADMIN" schoolId={schoolId}>
      {children}
    </AppShell>
  );
}

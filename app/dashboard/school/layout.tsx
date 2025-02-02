import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()
import { Sidebar } from '@/components/sidebar';
import SchoolDashboardLayout from '@/components/SchoolDashboardLayout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const session = await getServerSession(authOptions)
    const user=session.user
    let school, studentsCount = 0, reportsCount = 0;
  
    if (user?.role === 'SCHOOL_ADMIN') {
      school = await prisma.school.findUnique({
        where: { userId: user.id },
        include: {
          _count: {
            select: {
              students: true,
              reports: true
            }
          }
        }
      });
  
      studentsCount = school?._count?.students || 0;
      reportsCount = school?._count?.reports || 0;
    }
  
  return (
   
      <SchoolDashboardLayout school={school} user={user} >
      {children}
      </SchoolDashboardLayout>
    
  );
}
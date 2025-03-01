import { PrismaClient } from '@prisma/client'

import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import StudentsList from '@/components/StudentList';
import DashboardLayout from '../admin/layout';

import {SchoolCard ,  StatsCard } from '@/components/SchoolCard';
import SchoolDashboardLayout from '@/components/SchoolDashboardLayout';
const prisma = new PrismaClient()
export default async function DashboardPage() {
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
   
        <>
          <SchoolCard school={school} />
          <StatsCard
            studentsCount={studentsCount}
            reportsCount={reportsCount}
            phone={school.phone}
            established={school.createdAt}
          />
        </>
      )}
   
  

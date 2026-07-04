'use server'
import prisma from '@/lib/prisma'
export async function getSchoolReports() {
  
  try {
    const reports = await prisma.schoolReport.findMany({
      include: {
        school: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return reports;
  } catch (error) {
    console.error('Error fetching school reports:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

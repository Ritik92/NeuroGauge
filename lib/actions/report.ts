'use server';
import { auth } from '@/auth.config';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

export async function getStudentReports() {
   const session = await auth()
        
        if (!session?.user?.id) {
          throw new Error("Unauthorized")
        }
    const user =session.user;
  if (!user || user.role !== 'STUDENT') throw new Error('Unauthorized');

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true }
  });

  if (!student) throw new Error('Student not found');

  return prisma.report.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getStudentReport(id: string) {
    const session = await auth()
      
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }
const user =session.user;
  if (!user || user.role !== 'STUDENT') throw new Error('Unauthorized');

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: { id: true }
  });

  if (!student) throw new Error('Student not found');

  return prisma.report.findUnique({
    where: { id, studentId: student.id }
  });
}
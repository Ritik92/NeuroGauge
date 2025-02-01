
'use server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { auth } from "@/auth.config";

export async function getParentStudents() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;
  if (!user || user.role !== 'PARENT') throw new Error('Unauthorized');

  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: {
      students: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          grade: true
        }
      }
    }
  });

  if (!parent) throw new Error('Parent not found');

  return parent.students;
}

// actions/report.ts
export async function getStudentReportsForParent(studentId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;
  if (!user || user.role !== 'PARENT') throw new Error('Unauthorized');

  // Verify that the student belongs to this parent
  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    include: {
      students: {
        where: { id: studentId },
        select: { id: true }
      }
    }
  });

  if (!parent || parent.students.length === 0) {
    throw new Error('Unauthorized access to student reports');
  }

  return prisma.report.findMany({
    where: { studentId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getParentStudentReport(reportId: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;
  if (!user || user.role !== 'PARENT') throw new Error('Unauthorized');

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      student: {
        include: {
          parents: {
            where: { userId: user.id },
            select: { id: true }
          }
        }
      }
    }
  });

  if (!report || report.student.parents.length === 0) {
    throw new Error('Unauthorized access to report');
  }

  return report;
}
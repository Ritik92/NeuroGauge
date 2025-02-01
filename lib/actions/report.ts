'use server';
import { auth } from '@/auth.config';
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
export async function getmyStudentReports() {
  const session = await auth()
       
       if (!session?.user?.id) {
         throw new Error("Unauthorized")
       }
   let user =session.user;
 if (!user || user.role !== 'PARENT') throw new Error('Unauthorized');
  const res = await prisma.user.findUnique({
  where: { email: session.user.email },
  include: { parent: true }
})

if (!res?.parent) {
  return ('Error parent not found')
}

// Fetch all children and their reports
const childrenWithReports = await prisma.student.findMany({
  where: {
    parents: {
      some: { id: res.parent.id }
    }
  },
  select: {
    reports: {
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        data: true,
        createdAt: true,
      }
    },
    // Also include assessment completion data
   
  }
})

// Process and structure the data

return (childrenWithReports)

}

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
export async function getParentReport(id: string) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const user = session.user;
  if (!user || user.role !== 'PARENT') {
    throw new Error("Unauthorized");
  }

  // Find the parent
  const parent = await prisma.parent.findUnique({
    where: { userId: user.id },
    select: { id: true }
  });

  if (!parent) {
    throw new Error("Parent not found");
  }

  // Find the report and verify the parent has access to the student
  const report = await prisma.report.findUnique({
    where: { 
      id 
    },
    include: {
      student: {
        include: {
          parents: {
            where: { id: parent.id },
            select: { id: true }
          }
        }
      }
    }
  });

  // If report doesn't exist or parent doesn't have access to the student
  if (!report || report.student.parents.length === 0) {
    throw new Error("Report not found or unauthorized access");
  }

  // Return the report without the parents data
  return {
    ...report,
    student: {
      ...report.student,
      parents: undefined
    }
  };
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
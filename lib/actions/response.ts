'use server';
import { auth } from '@/auth.config';
import { getServerSession } from 'next-auth';

import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
export async function submitAssessmentResponse(data: {
  assessmentId: string;
  responses: { questionId: string; value: any }[];
}) {
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
  // First, create or update the StudentAssessment entry
  await prisma.studentAssessment.upsert({
    where: {
      studentId_assessmentId: {
        studentId: student.id,
        assessmentId: data.assessmentId
      }
    },
    update: {
      status: 'COMPLETED',
      completedAt: new Date()
    },
    create: {
      studentId: student.id,
      assessmentId: data.assessmentId,
      status: 'COMPLETED',
      startedAt: new Date(),
      completedAt: new Date()
    }
  });
  return prisma.$transaction([
    ...data.responses.map(response =>
      prisma.response.create({
        data: {
          value: response.value,
          studentId: student.id,
          assessmentId: data.assessmentId,
          questionId: response.questionId
        }
      })
    )
  ]);
}
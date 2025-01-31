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
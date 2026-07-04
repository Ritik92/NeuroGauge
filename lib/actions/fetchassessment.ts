'use server'
import prisma from '@/lib/prisma'
export async function getAssessments() {
    
    try {
      const assessments = await prisma.assessment.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return assessments;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
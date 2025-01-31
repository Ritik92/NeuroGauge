// app/api/students/bulk-upload/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { StudentCSVSchema } from '@/lib/validations/student';
import { auth } from '@/auth.config';
const prisma = new PrismaClient()
export async function POST(req: Request) {
  try {
    const session = await auth()
          
    if (!session?.user?.id) {
      throw new Error("Unauthorized")
    }
const user =session.user;
    if (!user || user.role !== 'SCHOOL_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const school = await prisma.school.findUnique({
      where: { userId: user.id },
      select: { id: true }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    const csvData = await req.json();
    const results = await processStudents(csvData, school.id);
    
    return NextResponse.json({
      success: true,
      createdCount: results.createdCount,
      errorCount: results.errorCount,
      errors: results.errors
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function processStudents(data: any[], schoolId: string) {
  const batchSize = 100; // Process in batches
  const results = {
    createdCount: 0,
    errorCount: 0,
    errors: [] as Array<{ row: number; error: string }>
  };

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    const batchResults = await processBatch(batch, schoolId, i);
    
    results.createdCount += batchResults.createdCount;
    results.errorCount += batchResults.errorCount;
    results.errors.push(...batchResults.errors);
  }

  return results;
}

async function processBatch(batch: any[], schoolId: string, offset: number) {
  const batchResults = {
    createdCount: 0,
    errorCount: 0,
    errors: [] as Array<{ row: number; error: string }>
  };

  await Promise.allSettled(
    batch.map(async (row, index) => {
      const originalRowNumber = offset + index + 1;
      try {
        const validatedData = StudentCSVSchema.parse({
          ...row,
          grade: parseInt(row.grade),
          dateOfBirth: new Date(row.dateOfBirth).toISOString()
        });

        const existingUser = await prisma.user.findUnique({
          where: { email: validatedData.email }
        });

        if (existingUser) {
          throw new Error('Email already exists');
        }

        await prisma.user.create({
          data: {
            email: validatedData.email,
            password: generateTempPassword(),
            role: 'STUDENT',
            student: {
              create: {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                dateOfBirth: validatedData.dateOfBirth,
                grade: validatedData.grade,
                schoolId: schoolId
              }
            }
          }
        });

        batchResults.createdCount++;
      } catch (error) {
        batchResults.errorCount++;
        batchResults.errors.push({
          row: originalRowNumber,
          error: error.message
        });
      }
    })
  );

  return batchResults;
}

function generateTempPassword(): string {
  return Math.random().toString(36).slice(-8);
}
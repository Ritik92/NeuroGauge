import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const [
      totalSchools,
      totalStudents,
      totalParents,
      totalAssessments
    ] = await Promise.all([
      prisma.school.count(),
      prisma.student.count(),
      prisma.parent.count(),
      prisma.assessment.count()
    ]);

    return NextResponse.json({
      totalSchools,
      totalStudents,
      totalParents,
      totalAssessments
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
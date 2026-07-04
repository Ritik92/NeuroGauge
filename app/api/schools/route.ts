import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      include: {
        reports: true,
        user:true
      }
    });
    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}
import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        createdAt: true
      }
    });

    return NextResponse.json(schools);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch recent schools' },
      { status: 500 }
    );
  }
}

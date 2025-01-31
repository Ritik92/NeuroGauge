import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const schoolsByState = await prisma.school.groupBy({
      by: ['state'],
      _count: true,
      orderBy: {
        _count: {
          state: 'desc'
        }
      }
    });

    const data = schoolsByState.map(({ state, _count }) => ({
      state,
      count: _count
    }));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch school distribution' },
      { status: 500 }
    );
  }
}
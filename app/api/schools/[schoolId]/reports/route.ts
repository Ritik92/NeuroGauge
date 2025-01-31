import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: any
) {
  try {
    const reports = await prisma.schoolReport.findMany({
      where: { schoolId: params.schoolId },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch school reports' },
      { status: 500 }
    );
  }
}
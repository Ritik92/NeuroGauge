// app/schools/[schoolId]/reports/page.tsx
import { SchoolReports } from '@/components/school-reports';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

async function getSchool(schoolId: string) {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
  });
  return school;
}

export default async function SchoolReportPage({
  params,
}: {
  params: any;
}) {
  const school = await getSchool(params.schoolId);
  
  if (!school) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{school.name} Reports</h1>
      <SchoolReports schoolId={params.schoolId} />
    </div>
  );
}
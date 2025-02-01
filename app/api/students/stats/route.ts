// app/api/student/stats/route.ts
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the student data based on email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true }
    })

    if (!user?.student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Get student-specific stats
    const [
      totalAssessments,
      completedAssessments,
      latestReport,
      schoolInfo,
      parentInfo
    ] = await Promise.all([
      prisma.assessment.count({
        where: { students: { some: { id: user.student.id } } }
      }),
      prisma.response.count({
        where: { studentId: user.student.id }
      }),
      prisma.report.findFirst({
        where: { studentId: user.student.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.school.findUnique({
        where: { id: user.student.schoolId || '' },
        select: { name: true, city: true, state: true }
      }),
      prisma.parent.findMany({
        where: { students: { some: { id: user.student.id } } },
        select: { firstName: true, lastName: true, phone: true }
      })
    ])

    return NextResponse.json({
      student: {
        name: `${user.student.firstName} ${user.student.lastName}`,
        grade: user.student.grade,
      },
      stats: {
        totalAssessments,
        completedAssessments,
        pendingAssessments: totalAssessments - completedAssessments
      },
      latestReport,
      schoolInfo,
      parentInfo
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch student stats' },
      { status: 500 }
    )
  }
}
import { PrismaClient, CompletionStatus } from '@prisma/client'
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
      studentAssessments,
      latestReport,
      schoolInfo,
      parentInfo
    ] = await Promise.all([
      prisma.assessment.count({
        where: { 
          students: { some: { id: user.student.id } },
          status: 'PUBLISHED',
          gradeLevel: { hasSome: [user.student.grade] } // Match student's grade
        }
      }),
      prisma.studentAssessment.findMany({
        where: { 
          studentId: user.student.id,
          assessment: {
            status: 'PUBLISHED',
            gradeLevel: { hasSome: [user.student.grade] } // Match student's grade
          }
        },
        include: { 
          assessment: {
            select: { 
              title: true, 
              type: true,
              description: true,
              gradeLevel: true
            } 
          }
        }
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

    // Calculate assessment statuses
    const assessmentStats = {
      total: totalAssessments,
      pending: studentAssessments.filter(sa => sa.status === 'PENDING').length,
      inProgress: studentAssessments.filter(sa => sa.status === 'IN_PROGRESS').length,
      completed: studentAssessments.filter(sa => sa.status === 'COMPLETED').length,
      expired: studentAssessments.filter(sa => sa.status === 'EXPIRED').length
    }

    // Prepare detailed assessment information
    const assessmentDetails = studentAssessments.map(sa => ({
      title: sa.assessment.title,
      type: sa.assessment.type,
      description: sa.assessment.description,
      status: sa.status,
      startedAt: sa.startedAt,
      completedAt: sa.completedAt
    }))

    return NextResponse.json({
      student: {
        name: `${user.student.firstName} ${user.student.lastName}`,
        grade: user.student.grade,
      },
      assessmentStats,
      assessmentDetails,
      latestReport,
      schoolInfo,
      parentInfo
    })
  } catch (error) {
    console.error('Error fetching student stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student stats' },
      { status: 500 }
    )
  }
}
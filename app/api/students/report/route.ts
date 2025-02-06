import { PrismaClient, CompletionStatus } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { reportData, assessmentId } = body

    if (!reportData || !assessmentId) {
      return NextResponse.json(
        { error: 'Missing required fields: reportData or assessmentId' },
        { status: 400 }
      )
    }

    // Get the student data based on email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { student: true }
    })

    if (!user?.student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Verify that the student has access to this assessment
    const studentAssessment = await prisma.studentAssessment.findUnique({
      where: {
        studentId_assessmentId: {
          studentId: user.student.id,
          assessmentId
        }
      }
    })

    if (!studentAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found for this student' },
        { status: 404 }
      )
    }

    // Create report and update assessment status in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          studentId: user.student.id,
          data: reportData
        }
      })

      await tx.studentAssessment.update({
        where: {
          studentId_assessmentId: {
            studentId: user.student.id,
            assessmentId
          }
        },
        data: {
          status: CompletionStatus.COMPLETED,
          completedAt: new Date()
        }
      })

      return report
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report', details: error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
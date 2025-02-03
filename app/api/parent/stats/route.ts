import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { z } from 'zod'

const prisma = new PrismaClient()

// Type for assessment progress
type AssessmentProgress = {
  assessmentId: string
  title: string
  totalQuestions: number
  answeredQuestions: number
  progressPercentage: number
}

// Type for child stats
type ChildStats = {
  totalAssessments: number
  completedAssessments: number
  pendingAssessments: number
  assessmentProgress: AssessmentProgress[]
}

// Type for API response
type ApiResponse = {
  parent: {
    name: string
    phone: string | null
  }
  stats: {
    totalChildren: number
    totalAssessments: number
    completedAssessments: number
    schoolsCount: number
  }
  children: Array<{
    id: string
    name: string
    grade: number
    school: string | null
    stats: ChildStats
    latestReport: { id: string; data: any } | null
  }>
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get parent data with proper type checking
    const parent = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        parent: true
      }
    })

    if (!parent?.parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Get children data with all necessary relations
    const children = await prisma.student.findMany({
      where: {
        parents: {
          some: { id: parent.parent.id }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        grade: true,
        school: {
          select: {
            name: true
          }
        },
        studentAssessments: {
          where: {
            assessment: {
              status: 'PUBLISHED'
            }
          },
          select: {
            assessment: {
              select: {
                id: true,
                title: true,
                questions: {
                  select: {
                    id: true
                  }
                }
              }
            },
            status: true
          }
        },
        responses: {
          select: {
            assessmentId: true,
            questionId: true
          }
        },
        reports: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            id: true,
            data: true
          }
        }
      }
    })

    // Process data for response
    const processedData: ApiResponse = {
      parent: {
        name: `${parent.parent.firstName} ${parent.parent.lastName}`,
        phone: parent.parent.phone
      },
      stats: {
        totalChildren: children.length,
        totalAssessments: children.reduce((sum, child) => 
          sum + child.studentAssessments.length, 0),
        completedAssessments: children.reduce((sum, child) => {
          return sum + child.studentAssessments.filter(sa => 
            sa.status === 'COMPLETED'
          ).length
        }, 0),
        schoolsCount: new Set(children.map(child => child.school?.name).filter(Boolean)).size
      },
      children: children.map(child => {
        const assessmentProgress: AssessmentProgress[] = child.studentAssessments.map(sa => {
          const assessment = sa.assessment
          const totalQuestions = assessment.questions.length
          const answeredQuestions = new Set(
            child.responses
              .filter(r => r.assessmentId === assessment.id)
              .map(r => r.questionId)
          ).size

          return {
            assessmentId: assessment.id,
            title: assessment.title,
            totalQuestions,
            answeredQuestions,
            progressPercentage: totalQuestions === 0 ? 0 : 
              Math.round((answeredQuestions / totalQuestions) * 100)
          }
        })

        const completedAssessments = assessmentProgress.filter(
          ap => ap.progressPercentage === 100
        ).length

        return {
          id: child.id,
          name: `${child.firstName} ${child.lastName}`,
          grade: child.grade,
          school: child.school?.name ?? null,
          stats: {
            totalAssessments: child.studentAssessments.length,
            completedAssessments,
            pendingAssessments: child.studentAssessments.length - completedAssessments,
            assessmentProgress
          },
          latestReport: child.reports[0] ?? null
        }
      })
    }

    return NextResponse.json(processedData)
  } catch (error) {
    console.error('Parent stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch parent stats' },
      { status: 500 }
    )
  }
}
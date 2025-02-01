// app/api/parent/stats/route.ts
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

    // Get the parent data based on email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { parent: true }
    })

    if (!user?.parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Get parent-specific stats and children data
    const children = await prisma.student.findMany({
      where: { parents: { some: { id: user.parent.id } } },
      include: {
        school: {
          select: { name: true, city: true, state: true }
        },
        assessments: true,
        responses: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    // Calculate aggregate stats
    const stats = {
      totalChildren: children.length,
      totalAssessments: children.reduce((sum, child) => sum + child.assessments.length, 0),
      completedAssessments: children.reduce((sum, child) => sum + child.responses.length, 0),
      schoolsCount: new Set(children.map(child => child.school?.name)).size
    }

    // Process children data for display
    const childrenData = children.map(child => ({
      id: child.id,
      name: `${child.firstName} ${child.lastName}`,
      grade: child.grade,
      school: child.school?.name,
      stats: {
        totalAssessments: child.assessments.length,
        completedAssessments: child.responses.length,
        pendingAssessments: child.assessments.length - child.responses.length
      },
      latestReport: child.reports[0] || null
    }))

    return NextResponse.json({
      parent: {
        name: `${user.parent.firstName} ${user.parent.lastName}`,
        phone: user.parent.phone
      },
      stats,
      children: childrenData
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch parent stats' },
      { status: 500 }
    )
  }
}
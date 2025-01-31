import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const grade = searchParams.get('grade')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // First get the school associated with this user
    const school = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        school: {
          select: { id: true }
        }
      }
    })

    if (!school?.school?.id) {
      return NextResponse.json(
        { error: 'No school found for this user' },
        { status: 404 }
      )
    }

    const students = await prisma.student.findMany({
      where: {
        schoolId: school.school.id,
        grade: grade ? parseInt(grade) : undefined
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        grade: 'asc'
      }
    })

    const formattedStudents = students.map(student => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.user.email,
      grade: student.grade,
      dateOfBirth: student.dateOfBirth.toISOString().split('T')[0]
    }))

    return NextResponse.json(formattedStudents)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}
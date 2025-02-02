// app/student/assignments/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { AssignmentList } from "@/components/student/AssignmentList"
import { PrismaClient } from '@prisma/client'
import { authOptions } from "@/auth.config"

const prisma = new PrismaClient()

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: { school: true }
  })

  if (!student) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Student record not found</div>
      </div>
    )
  }

  const assignments = await prisma.assessment.findMany({
    where: {
      status: 'PUBLISHED',
      gradeLevel: { has: student.grade }
    },
    include: {
      questions: true,
      responses: {
        where: {
          studentId: student.id
        }
      }
    }
  })

  const assignmentsWithStatus = assignments.map(assessment => ({
    ...assessment,
    completed: assessment.responses.length > 0
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
          My Assignments
        </h1>
        <p className="text-gray-600 mt-2">
          Complete your assessments to unlock personalized insights
        </p>
      </div>
      
      <AssignmentList assignments={assignmentsWithStatus} />
    </div>
  )
}
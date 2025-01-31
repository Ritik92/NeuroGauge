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

  // First get the student record
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: { school: true }
  })

  if (!student) {
    return <div>Student record not found</div>
  }

  // Now get assessments for the student's school
  const assignments = await prisma.assessment.findMany({
    where: {
      status: 'PUBLISHED',
      // Add any school-specific logic if needed
      // schoolId: student.schoolId 
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

  // Add completion status
  const assignmentsWithStatus = assignments.map(assessment => ({
    ...assessment,
    completed: assessment.responses.length > 0
  }))

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Assignments</h1>
      <AssignmentList assignments={assignmentsWithStatus} />
    </div>
  )
}
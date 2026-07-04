// app/student/assignments/page.tsx
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { AssignmentList } from "@/components/student/AssignmentList"
import { authOptions } from "@/auth.config"

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: { school: true }
  })

  if (!student) {
    return (
      <div style={{ color: 'var(--muted)', fontSize: 15, padding: 8 }}>Student record not found</div>
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
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Assignments</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Complete your assessments to unlock personalized insights.</p>
      <div style={{ marginTop: 26 }}>
        <AssignmentList assignments={assignmentsWithStatus as any} />
      </div>
    </div>
  )
}

// app/student/assignments/[id]/page.tsx
import prisma from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import AssessmentForm from '../../../../../components/student/AssesementForm'
export default async function TakeAssessmentPage({
  params
}: any) {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' }
      }
    }
  })
  console.log(assessment)

  if (!assessment) {
    redirect('/student/assignments')
  }
  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <AssessmentForm assessment={assessment} />
    </div>
  )
}
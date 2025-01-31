// app/student/assignments/[id]/page.tsx
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import AssessmentForm from '../../../../components/student/AssesementForm'


import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
export default async function TakeAssessmentPage({
  params
}: {
  params: { id: string }
}) {
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

  if (!assessment) {
    redirect('/student/assignments')
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
      <p className="text-muted-foreground mb-8">{assessment.description}</p>
      <AssessmentForm assessment={assessment} />
    </div>
  )
}
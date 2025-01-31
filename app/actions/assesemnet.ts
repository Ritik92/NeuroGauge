// app/actions/assessment.ts
'use server'

import { db } from "@/lib/db"
import { getServerSession } from "next-auth/next"

import { revalidatePath } from "next/cache"

interface ResponseInput {
  questionId: string
  value: any
}

export async function submitResponse({
  assessmentId,
  responses
}: {
  assessmentId: string
  responses: ResponseInput[]
}) {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const student = await db.student.findFirst({
    where: { userId: session.user.id }
  })

  if (!student) {
    throw new Error("Student not found")
  }

  // Create all responses in a transaction
  await db.$transaction(
    responses.map(response => 
      db.response.create({
        data: {
          value: response.value,
          studentId: student.id,
          assessmentId,
          questionId: response.questionId
        }
      })
    )
  )

  revalidatePath('/student/assignments')
  revalidatePath(`/student/assignments/${assessmentId}`)
}
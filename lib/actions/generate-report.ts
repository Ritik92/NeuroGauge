'use server'

import { zodResponseFormat } from 'openai/helpers/zod'
import { auth } from '@/auth.config'
import prisma from '@/lib/prisma'
import { getOpenAI, OPENAI_MODEL } from '@/lib/ai/openai'
import { ReportSchema, type ProcessedData } from '@/lib/ai/report-schema'

interface ResponseInput {
  questionId: string
  value: unknown
}

interface ProcessedResponse {
  question: string
  type: string
  answer: string | number
}

function buildPrompt(
  student: { firstName: string; grade: number },
  processedResponses: ProcessedResponse[]
): string {
  return `Act as an expert career counselor and educational psychologist with 20+ years of experience. Analyze the assessment data below for a Grade ${student.grade} student (first name: ${student.firstName}) and produce a comprehensive psychometric report.

Analysis Requirements:
1. Derive cognitive scores (0-100) from the question types and responses.
2. Determine primary/secondary learning styles (Gardner's intelligences) from response patterns.
3. Infer an MBTI personality type (4-letter code with label) from response tendencies.
4. List concrete strengths whose scores match the cognitive profile.
5. Give 2-3 development areas focused on academic-impact skill gaps (not personality).
6. Recommend 3-4 specific interventions, each with an icon from: Book, Brain, Users, Target.
7. Career recommendations must align with the cognitive strengths and learning style, be grade-appropriate, and reference specific cognitive scores in their reasoning.
   - bestCareer.field and every suggestedCareers[].field must be one of: STEM, Arts, Business, Technology, Education, Engineering.
   - Provide at least two suggestedCareers, at least one in a different field from bestCareer.
- studentInfo.name should be the student's realistic full name (you may use the first name provided); grade should be a formatted grade level; age should be typical for the grade.

Questions and Responses:
${processedResponses
  .map((r, i) => `[Q${i + 1}] ${r.question}\nType: ${r.type}\nResponse: ${r.answer}`)
  .join('\n\n')}`
}

function calculateOverallPercentile(cognitiveProfile: Record<string, number>): number {
  const scores = Object.values(cognitiveProfile)
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

/**
 * Saves a student's assessment responses and generates their report entirely on
 * the server. The report content (scores, careers, etc.) is produced by OpenAI
 * here — it is never accepted from the client — so it cannot be forged.
 */
export async function submitAssessmentAndGenerateReport({
  assessmentId,
  responses,
}: {
  assessmentId: string
  responses: ResponseInput[]
}): Promise<{ reportId: string }> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  if (session.user.role !== 'STUDENT') throw new Error('Unauthorized')

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    select: { id: true, firstName: true, grade: true },
  })
  if (!student) throw new Error('Student not found')

  // Load the assessment + questions from the DB (source of truth) rather than
  // trusting anything the client sends about the questions.
  const assessment = await prisma.assessment.findUnique({
    where: { id: assessmentId },
    include: { questions: true },
  })
  if (!assessment) throw new Error('Assessment not found')

  const questionsById = new Map(assessment.questions.map((q) => [q.id, q]))

  const processedResponses: ProcessedResponse[] = []
  for (const response of responses) {
    const question = questionsById.get(response.questionId)
    if (!question) continue

    let formattedAnswer: string | number = String(response.value)
    if (question.type === 'MULTIPLE_CHOICE' && Array.isArray(question.options)) {
      const option = (question.options as Array<{ text: string; value: unknown }>).find(
        (opt) => String(opt.value) === String(response.value)
      )
      if (option) formattedAnswer = option.text
    }

    processedResponses.push({
      question: question.text,
      type: question.type,
      answer: formattedAnswer,
    })
  }

  if (processedResponses.length === 0) {
    throw new Error('No valid responses submitted')
  }

  // Persist the raw responses and mark the assessment complete.
  await prisma.$transaction([
    prisma.studentAssessment.upsert({
      where: { studentId_assessmentId: { studentId: student.id, assessmentId } },
      update: { status: 'COMPLETED', completedAt: new Date() },
      create: {
        studentId: student.id,
        assessmentId,
        status: 'COMPLETED',
        startedAt: new Date(),
        completedAt: new Date(),
      },
    }),
    ...responses
      .filter((r) => questionsById.has(r.questionId))
      .map((response) =>
        prisma.response.create({
          data: {
            value: response.value as object,
            studentId: student.id,
            assessmentId,
            questionId: response.questionId,
          },
        })
      ),
  ])

  // Generate the report with OpenAI structured outputs.
  const openai = getOpenAI()
  const completion = await openai.chat.completions.parse({
    model: OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are an expert educational psychologist. Respond only with data matching the provided JSON schema.',
      },
      { role: 'user', content: buildPrompt(student, processedResponses) },
    ],
    response_format: zodResponseFormat(ReportSchema, 'student_report'),
  })

  const parsed = completion.choices[0]?.message.parsed
  if (!parsed) throw new Error('Failed to generate report')

  const reportData: ProcessedData = {
    ...parsed,
    studentInfo: {
      ...parsed.studentInfo,
      assessmentDate: new Date().toISOString(),
      overallPercentile: calculateOverallPercentile(parsed.cognitiveProfile),
    },
  }

  const report = await prisma.report.create({
    data: { studentId: student.id, data: reportData as object },
  })

  return { reportId: report.id }
}

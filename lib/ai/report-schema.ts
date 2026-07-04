import { z } from 'zod'

// Career fields and recommendation icons the UI knows how to render
// (see components/report-interface.tsx: careerIconMap / iconMap).
export const CAREER_FIELDS = [
  'STEM',
  'Arts',
  'Business',
  'Technology',
  'Education',
  'Engineering',
] as const

export const RECOMMENDATION_ICONS = ['Book', 'Brain', 'Users', 'Target'] as const

const CareerRecommendation = z.object({
  title: z.string(),
  reason: z.string(),
  field: z.enum(CAREER_FIELDS),
})

// Schema the model must return. Server-computed fields (assessmentDate,
// overallPercentile) are intentionally excluded and added after parsing.
export const ReportSchema = z.object({
  studentInfo: z.object({
    name: z.string(),
    grade: z.string(),
    age: z.number(),
    personalityType: z.string(),
  }),
  cognitiveProfile: z.object({
    analyticalThinking: z.number(),
    creativeReasoning: z.number(),
    problemSolving: z.number(),
    memoryRecall: z.number(),
    spatialVisualization: z.number(),
    verbalComprehension: z.number(),
  }),
  learningStyle: z.object({
    primary: z.string(),
    secondary: z.string(),
    characteristics: z.array(z.string()),
  }),
  strengths: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      score: z.number(),
    })
  ),
  developmentAreas: z.array(z.string()),
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      icon: z.enum(RECOMMENDATION_ICONS),
    })
  ),
  bestCareer: CareerRecommendation,
  suggestedCareers: z.array(CareerRecommendation),
})

export type ReportModelOutput = z.infer<typeof ReportSchema>

// Full report shape stored in Report.data and consumed by the UI.
export type ProcessedData = ReportModelOutput & {
  studentInfo: ReportModelOutput['studentInfo'] & {
    assessmentDate: string
    overallPercentile: number
  }
}

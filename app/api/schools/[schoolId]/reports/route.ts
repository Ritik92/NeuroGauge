import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: any }
) {
  try {
    const school = await prisma.school.findUnique({
      where: { id: params.schoolId },
      include: {
        students: {
          include: {
            reports: true,
            user: true
          }
        }
      }
    })

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    // Process reports data
    const reports = school.students.flatMap(student => 
      student.reports.map(report => ({
        ...report,
        student: {
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade
        }
      }))
    )

    // Calculate aggregated metrics
    const cognitiveProfile = calculateCognitiveAverages(reports)
    const learningStyles = calculateLearningStyles(reports)
    const careerDistribution = calculateCareerDistribution(reports)
    const strengths = calculateCommonStrengths(reports)

    return NextResponse.json({
      schoolInfo: {
        name: school.name,
        gradeLevels: Array.from(new Set(school.students.map(s => s.grade))),
        totalStudents: school.students.length,
      },
      metrics: {
        cognitiveProfile,
        learningStyles,
        careerDistribution,
        strengths
      },
      rawReports: reports
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// Helper functions for calculations
function calculateCognitiveAverages(reports) {
  const initial = {
    memoryRecall: 0,
    problemSolving: 0,
    creativeReasoning: 0,
    analyticalThinking: 0,
    verbalComprehension: 0,
    spatialVisualization: 0,
    count: 0
  }

  const totals = reports.reduce((acc, report) => {
    const cognitive = report.data.cognitiveProfile
    if (cognitive) {
      acc.memoryRecall += cognitive.memoryRecall || 0
      acc.problemSolving += cognitive.problemSolving || 0
      acc.creativeReasoning += cognitive.creativeReasoning || 0
      acc.analyticalThinking += cognitive.analyticalThinking || 0
      acc.verbalComprehension += cognitive.verbalComprehension || 0
      acc.spatialVisualization += cognitive.spatialVisualization || 0
      acc.count++
    }
    return acc
  }, initial)

  return {
    memoryRecall: totals.memoryRecall / totals.count,
    problemSolving: totals.problemSolving / totals.count,
    creativeReasoning: totals.creativeReasoning / totals.count,
    analyticalThinking: totals.analyticalThinking / totals.count,
    verbalComprehension: totals.verbalComprehension / totals.count,
    spatialVisualization: totals.spatialVisualization / totals.count
  }
}

function calculateLearningStyles(reports) {
  const styles = reports.reduce((acc, report) => {
    const style = report.data.learningStyle?.primary
    if (style) acc[style] = (acc[style] || 0) + 1
    return acc
  }, {})

  return Object.entries(styles).map(([name, value]) => ({
    name,
    //@ts-ignore
    value: (value / reports.length) * 100
  }))
}

function calculateCareerDistribution(reports) {
  const careers = reports.reduce((acc, report) => {
    const mainCareer = report.data.bestCareer?.field
    if (mainCareer) acc[mainCareer] = (acc[mainCareer] || 0) + 1
    return acc
  }, {})

  return Object.entries(careers).map(([name, value]) => ({
    name,
    //@ts-ignore
    value: (value / reports.length) * 100
  }))
}

function calculateCommonStrengths(reports) {
  const strengthMap = new Map()
  
  reports.forEach(report => {
    report.data.strengths?.forEach(strength => {
      const count = strengthMap.get(strength.title) || 0
      strengthMap.set(strength.title, count + 1)
    })
  })

  return Array.from(strengthMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, count]) => ({ title, count }))
}
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  GraduationCap, 
  Book, 
  Users, 
  TrendingUp, 
  Award,
  School,
  BarChart3,
  Target,
  LineChart
} from 'lucide-react';

const demoData = {
  schoolInfo: {
    name: "Edison High School",
    year: "2024-2025",
    totalStudents: 1250,
    facultyCount: 85,
    location: "California, USA"
  },
  gradeWiseReport: {
    overallMetrics: {
      averageGPA: 3.6,
      attendanceRate: 95.8,
      studentTeacherRatio: "15:1",
      satisfactionScore: 92
    },
    gradeDistribution: [
      { grade: "1st", count: 320, avgScore: 75, improvement: +3.2 },
      { grade: "2nd", count: 310, avgScore: 76, improvement: +3.5 },
      { grade: "3rd", count: 330, avgScore: 78, improvement: +3.0 },
      { grade: "4th", count: 325, avgScore: 80, improvement: +4.0 },
      { grade: "5th", count: 315, avgScore: 82, improvement: +4.3 },
      { grade: "6th", count: 310, avgScore: 83, improvement: +4.5 },
      { grade: "7th", count: 300, avgScore: 84, improvement: +4.8 },
      { grade: "8th", count: 315, avgScore: 85, improvement: +5.0 },
      { grade: "9th", count: 320, avgScore: 88, improvement: +5.2 },
      { grade: "10th", count: 305, avgScore: 86, improvement: +4.8 },
      { grade: "11th", count: 315, avgScore: 89, improvement: +6.1 },
      { grade: "12th", count: 310, avgScore: 91, improvement: +5.9 }
    ]
    ,
    subjectPerformance: {
      Mathematics: { average: 88, improvement: +4.2, topPerformers: 92 },
      Science: { average: 86, improvement: +3.8, topPerformers: 88 },
      English: { average: 89, improvement: +5.1, topPerformers: 94 },
      History: { average: 85, improvement: +4.5, topPerformers: 90 },
      Languages: { average: 87, improvement: +4.0, topPerformers: 91 }
    }
  },
  yearlyReport: {
    academicAchievements: {
      graduationRate: 96.5,
      collegeAcceptance: 92,
      scholarshipRecipients: 45,
      nationalMeritScholars: 12
    },
    cognitiveMetrics: {
      criticalThinking: 88,
      problemSolving: 86,
      creativity: 90,
      analyticalSkills: 87
    },
    studentSuccess: {
      honorsStudents: 235,
      apPassRate: 89,
      competitionWinners: 28,
      researchPublications: 8
    },
    growthMetrics: {
      academicGrowth: +5.8,
      skillsDevelopment: +6.2,
      personalityDevelopment: +7.1,
      overallProgress: +6.4
    }
  }
};

const ReportSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);

export default function SchoolReports() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <School className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {demoData.schoolInfo.name} - Comprehensive Report
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(demoData.schoolInfo).map(([key, value], index) => (
            key !== 'name' && (
              <Badge key={index} variant="outline" className="bg-blue-50">
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Badge>
            )
          ))}
        </div>
      </div>

      {/* Overall Metrics */}
      <ReportSection>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Overall Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(demoData.gradeWiseReport.overallMetrics).map(([key, value], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-blue-50 rounded-lg text-center"
                >
                  <div className="text-sm text-blue-600 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{value}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ReportSection>

      {/* Grade Distribution */}
      <ReportSection>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Grade-wise Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grade Level</TableHead>
                  <TableHead>Student Count</TableHead>
                  <TableHead>Average Score</TableHead>
                  <TableHead>Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demoData.gradeWiseReport.gradeDistribution.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{grade.grade}</TableCell>
                    <TableCell>{grade.count}</TableCell>
                    <TableCell>{grade.avgScore}%</TableCell>
                    <TableCell className="text-green-600">+{grade.improvement}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </ReportSection>

      {/* Subject Performance */}
      <ReportSection>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Book className="w-5 h-5 text-blue-600" />
              <span>Subject Performance Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(demoData.gradeWiseReport.subjectPerformance).map(([subject, data], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-blue-50 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{subject}</span>
                    <Badge variant="secondary">Top Performers: {data.topPerformers}%</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.average}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average: {data.average}%</span>
                      <span className="text-green-600">Improvement: +{data.improvement}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ReportSection>

      {/* Academic Achievements */}
      <ReportSection>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Academic Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(demoData.yearlyReport.academicAchievements).map(([key, value], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border-2 border-blue-100 rounded-lg text-center hover:border-blue-300 transition-colors"
                >
                  <div className="text-2xl font-bold text-blue-600 mb-1">{value}%</div>
                  <div className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ReportSection>

      {/* Growth Metrics */}
      <ReportSection>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Growth Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(demoData.yearlyReport.growthMetrics).map(([key, value], index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-blue-50 rounded-lg text-center"
                >
                  <div className="text-2xl font-bold text-green-600">+{value}%</div>
                  <div className="text-sm text-gray-600">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ReportSection>
    </div>
  );
}

// app/schools/[schoolId]/reports/page.tsx
// import { SchoolReports } from '@/components/school-reports';
// import { notFound } from 'next/navigation';
// import { PrismaClient } from '@prisma/client'
// import { NextRequest, NextResponse } from 'next/server'

// const prisma = new PrismaClient()

// async function getSchool(schoolId: string) {
//   const school = await prisma.school.findUnique({
//     where: { id: schoolId },
//   });
//   return school;
// }

// export default async function SchoolReportPage({
//   params,
// }: {
//   params: any;
// }) {
//   const school = await getSchool(params.schoolId);
  
//   if (!school) {
//     notFound();
//   }

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6">{school.name} Reports</h1>
//       <SchoolReports schoolId={params.schoolId} />
//     </div>
//   );
// }
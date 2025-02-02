'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Brain, School, Book, HeartPulse, Target, Trophy, 
  GraduationCap, ChartLine, Users, Lightbulb 
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend
} from 'recharts';

// Enhanced data structure with grades 1-12
const schoolData = {
  info: {
    name: "Edison Academy",
    year: "2024-2025",
    students: 2400,
    faculty: 180,
    location: "California, USA",
    accreditation: "A+"
  },
  metrics: {
    cognitive: {
      gradeProgress: [
        { grade: "1st", score: 92, improvement: 4.2, students: 200 },
        { grade: "2nd", score: 90, improvement: 4.0, students: 195 },
        { grade: "3rd", score: 88, improvement: 3.8, students: 205 },
        { grade: "4th", score: 87, improvement: 3.7, students: 198 },
        { grade: "5th", score: 86, improvement: 3.6, students: 202 },
        { grade: "6th", score: 85, improvement: 3.5, students: 196 },
        { grade: "7th", score: 84, improvement: 3.4, students: 203 },
        { grade: "8th", score: 83, improvement: 3.3, students: 197 },
        { grade: "9th", score: 82, improvement: 3.2, students: 201 },
        { grade: "10th", score: 81, improvement: 3.1, students: 199 },
        { grade: "11th", score: 80, improvement: 3.0, students: 204 },
        { grade: "12th", score: 85, improvement: 3.5, students: 200 }
      ],
      learningStyles: [
        { name: "Visual", value: 35, description: "Learn through seeing" },
        { name: "Auditory", value: 25, description: "Learn through hearing" },
        { name: "Kinesthetic", value: 20, description: "Learn through doing" },
        { name: "Read/Write", value: 20, description: "Learn through text" }
      ]
    },
    emotional: {
      skills: [
        { name: "Self-Awareness", value: 82, benchmark: 75 },
        { name: "Social Skills", value: 76, benchmark: 70 },
        { name: "Motivation", value: 80, benchmark: 72 },
        { name: "Empathy", value: 77, benchmark: 71 },
        { name: "Leadership", value: 75, benchmark: 68 },
        { name: "Stress Management", value: 79, benchmark: 70 }
      ]
    },
    academic: {
      elementary: [
        { name: "Reading", score: 88, trend: 4.2 },
        { name: "Mathematics", score: 86, trend: 3.8 },
        { name: "Science", score: 85, trend: 3.5 },
        { name: "Social Studies", score: 87, trend: 3.9 }
      ],
      middle: [
        { name: "Language Arts", score: 84, trend: 3.2 },
        { name: "Pre-Algebra", score: 83, trend: 3.0 },
        { name: "Life Science", score: 85, trend: 3.4 },
        { name: "World History", score: 86, trend: 3.6 }
      ],
      high: [
        { name: "Advanced Literature", score: 82, trend: 2.8 },
        { name: "Advanced Math", score: 81, trend: 2.6 },
        { name: "Physics", score: 80, trend: 2.5 },
        { name: "World Languages", score: 83, trend: 3.0 }
      ]
    },
    growth: [
      { area: "Critical Analysis", current: 85, target: 100, improvement: 5 },
      { area: "Research Methods", current: 88, target: 100, improvement: 6 },
      { area: "Digital Literacy", current: 92, target: 100, improvement: 4 },
      { area: "Communication", current: 90, target: 100, improvement: 5 },
      { area: "Problem Solving", current: 87, target: 100, improvement: 7 },
      { area: "Creativity", current: 89, target: 100, improvement: 6 }
    ]
  }
};

const MetricCard = ({ title, value, trend, icon: Icon, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="p-6 bg-white rounded-xl shadow-lg border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center justify-between">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {value}
        </div>
        {trend && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
    {description && (
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    )}
  </motion.div>
);

export default function SchoolPsychometricDashboard() {
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('elementary');

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-xl shadow-lg border border-blue-100"
      >
        <div className="flex items-center space-x-6 mb-6">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-blue-100 rounded-full"
          >
            <School className="w-10 h-10 text-blue-600" />
          </motion.div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {schoolData.info.name}
            </h1>
            <p className="text-lg text-gray-600">Comprehensive Psychometric Analysis Dashboard</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(schoolData.info).map(([key, value]) => (
            key !== 'name' && (
              <Badge 
                key={key} 
                variant="secondary" 
                className="px-4 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </Badge>
            )
          ))}
        </div>
      </motion.div>

      {/* Grade Progress */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChartLine className="w-6 h-6 text-blue-600" />
            <span>Academic Progress Across Grades</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={schoolData.metrics.cognitive.gradeProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" />
                <YAxis domain={[60, 100]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-100">
                          <p className="font-bold text-gray-800">{label} Grade</p>
                          <p className="text-blue-600">Score: {payload[0].value}</p>
                          <p className="text-green-600">Improvement: +{payload[0].payload.improvement}%</p>
                          <p className="text-gray-600">Students: {payload[0].payload.students}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: "#2563EB" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance by Grade Level */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            <span>Academic Performance by Grade Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="elementary" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="elementary">Elementary</TabsTrigger>
              <TabsTrigger value="middle">Middle School</TabsTrigger>
              <TabsTrigger value="high">High School</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              {['elementary', 'middle', 'high'].map((level) => (
                <TabsContent key={level} value={level}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {schoolData.metrics.academic[level].map((subject) => (
                      //@ts-ignore
                      <MetricCard
                        key={subject.name}
                        title={subject.name}
                        value={`${subject.score}%`}
                        trend={subject.trend}
                        icon={Book}
                      />
                    ))}
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>

      {/* Emotional Intelligence */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-blue-600" />
            <span>Emotional Intelligence Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={schoolData.metrics.emotional.skills}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="name" 
                  tick={{ fill: '#4B5563', fontSize: 12 }}
                />
                <Radar 
                  name="Current" 
                  dataKey="value" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  stroke="#2563EB"
                  strokeWidth={2}
                />
                <Radar 
                  name="Benchmark" 
                  dataKey="benchmark" 
                  fill="#9CA3AF" 
                  fillOpacity={0.3}
                  stroke="#6B7280"
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Growth Areas */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-6 h-6 text-blue-600" />
            <span>Growth Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schoolData.metrics.growth.map((item, index) => (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow border border-blue-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-700">{item.area}</span>
                  <Badge variant="secondary" className="bg-blue-50">
                    +{item.improvement}% Growth
                  </Badge>
                </div>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-blue-600">{item.current}%</span>
                  <span className="text-sm text-gray-500 ml-2">of target</span>
                </div>
                <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.current / item.target) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-gray-600">Current Progress</span>
                  <span className="text-gray-600">Target: {item.target}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Styles Distribution */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            <span>Learning Styles Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schoolData.metrics.cognitive.learningStyles}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 rounded-lg shadow-lg border border-blue-100">
                          <p className="font-bold text-gray-800">{label}</p>
                          <p className="text-blue-600">{payload[0].value}% of students</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {payload[0].payload.description}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                >
                  {schoolData.metrics.cognitive.learningStyles.map((entry, index) => (
                    <motion.rect 
                      key={`bar-${index}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 py-6"
      >
        <p>© {new Date().getFullYear()} {schoolData.info.name} - Psychometric Analysis Dashboard</p>
      </motion.div>
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
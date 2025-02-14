'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { 
  Brain, 
  Book, 
  Users, 
  Lightbulb, 
  Briefcase, 
  GraduationCap,
  AlertCircle, 
  Download,
  ArrowUpRight
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  Area,
  AreaChart
} from 'recharts'
import { useParams } from 'next/navigation'

// Types
interface SchoolInfo {
  name: string
  totalStudents: number
  gradeLevels: string[]
}

interface Strength {
  title: string
  count: number
}

interface ReportMetrics {
  cognitiveProfile: Record<string, number>
  learningStyles: Array<{ name: string; value: number }>
  careerDistribution: Array<{ name: string; value: number }>
  strengths: Strength[]
}

interface ReportData {
  schoolInfo: SchoolInfo
  metrics: ReportMetrics
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<any>
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((item, index) => (
          <p key={index} className="text-sm text-gray-600">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color || item.fill }}
            />
            {item.value}%
          </p>
        ))}
      </div>
    )
  }
  return null
}

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ 
  value, 
  duration = 2 
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = (timestamp - startTime) / (duration * 1000)

      if (progress < 1) {
        setCount(Math.min(Math.floor(value * progress), value))
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }
    
    animationFrameId = requestAnimationFrame(animate)
    return () => animationFrameId && cancelAnimationFrame(animationFrameId)
  }, [value, duration])

  return <span className="font-mono tabular-nums">{count.toLocaleString()}</span>
}

const DashboardCard: React.FC<{
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  description?: string
  className?: string
}> = ({ title, icon: Icon, children, description, className = "" }) => (
  <Card className={`bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-xl ${className}`}>
    <CardHeader className="space-y-2">
      <CardTitle className="flex items-center gap-3 text-xl">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-gray-600">
          {description}
        </CardDescription>
      )}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
)

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
    />
    <p className="text-lg text-gray-600 animate-pulse">Loading dashboard data...</p>
  </div>
)

const SchoolPsychometricDashboard: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const params = useParams()
  const schoolId = params?.schoolId as string
  const dashboardRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/schools/${schoolId}/reports`)
        if (!response.ok) throw new Error('Failed to fetch report data')
        const data = await response.json()
        setReportData(data)
        setError(null)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [schoolId])

  const downloadAsPDF = async () => {
    if (!dashboardRef.current || !reportData) return
    
    try {
      setExporting(true)
      const element = dashboardRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      })
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm'
      })
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${reportData.schoolInfo.name}-analytics-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <LoadingState />
  if (error) return (
    <Alert variant="destructive" className="max-w-xl mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
  if (!reportData) return (
    <Alert className="max-w-xl mx-auto mt-8">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>No report data found</AlertDescription>
    </Alert>
  )

  const chartTheme = {
    grid: '#E5E7EB',
    text: '#374151',
    primary: '#2563EB',
    secondary: '#60A5FA',
    background: '#F8FAFC'
  }

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {reportData.schoolInfo.name}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Analytics Dashboard
              </p>
            </div>
            <button
              onClick={downloadAsPDF}
              disabled={exporting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={reportData.schoolInfo.totalStudents} />
                </p>
              </div>
            </div>
          </motion.div>

        

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-md md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(Object.values(reportData.metrics.cognitiveProfile)
                    .reduce((a, b) => a + b, 0) / Object.keys(reportData.metrics.cognitiveProfile).length)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cognitive Profile */}
          <DashboardCard
            title="Cognitive Profile Analysis"
            icon={Brain}
            description="Distribution of cognitive abilities across key domains"
          >
            <div className="h-[400px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={Object.entries(reportData.metrics.cognitiveProfile)
                    .map(([name, value]) => ({ name, value }))}
                >
                  <PolarGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: chartTheme.text, fontSize: 12 }}
                  />
                  <Radar
                    name="Cognitive Score"
                    dataKey="value"
                    fill={chartTheme.primary}
                    fillOpacity={0.3}
                    stroke={chartTheme.primary}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Learning Styles */}
          <DashboardCard
            title="Learning Style Preferences"
            icon={Lightbulb}
            description="Analysis of predominant learning methods"
          >
            <div className="h-[400px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={reportData.metrics.learningStyles}
                  barSize={40}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={chartTheme.grid}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartTheme.text }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <YAxis 
                    unit="%" 
                    tick={{ fill: chartTheme.text }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill={chartTheme.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
                </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Career Distribution */}
          <DashboardCard
            title="Career Interest Trends"
            icon={Briefcase}
            description="Evolution of student career preferences"
          >
            <div className="h-[400px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.metrics.careerDistribution}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={chartTheme.grid}
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: chartTheme.text }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <YAxis 
                    unit="%" 
                    tick={{ fill: chartTheme.text }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartTheme.primary}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Student Strengths */}
          <DashboardCard
            title="Notable Student Strengths"
            icon={GraduationCap}
            description="Most prevalent strengths in student population"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <AnimatePresence>
                {reportData.metrics.strengths.map((strength, index) => (
                  <motion.div
                    key={strength.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity" />
                    <h3 className="font-semibold text-blue-700 mb-2 group-hover:text-blue-800 transition-colors">
                      {strength.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${Math.round((strength.count / reportData.schoolInfo.totalStudents) * 100)}%` 
                          }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-blue-600"
                        />
                      </div>
                      <span className="text-sm text-blue-600 font-medium">
                        {Math.round((strength.count / reportData.schoolInfo.totalStudents) * 100)}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {strength.count.toLocaleString()} students
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default SchoolPsychometricDashboard
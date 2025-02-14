'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'sonner'
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
  payload?: Array<{ payload: { name: string; value: number }; color: string; value: number }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm"
      >
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-gray-700">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color || '#2563EB' }}
            />
            <span className="font-medium">{Math.round(entry.value)}%</span>
          </div>
        ))}
      </motion.div>
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
  <Card className={`bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl border border-gray-100 ${className}`}>
    <CardHeader className="space-y-2">
      <CardTitle className="flex items-center gap-3 text-xl font-semibold">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-gray-600 text-sm">
          {description}
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="p-6">{children}</CardContent>
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
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    // Mobile detection
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        toast.info('For best experience, please view this report on a desktop device.', {
          duration: 6000,
          position: 'top-center'
        })
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
        scale: 3,
        logging: false,
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })
      
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const orientation = imgHeight > imgWidth ? 'portrait' : 'landscape'
      
      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: [imgWidth, imgHeight]
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
    grid: '#E2E8F0',
    text: '#1F2937',
    primary: '#2563EB',
    secondary: '#60A5FA',
    background: '#F8FAFC',
    accent: '#818CF8'
  }
  const truncateLabel = (label: string) => {
    if (isMobile && label.length > 8) return `${label.substring(0, 6)}...`
    return label
  }

  const formatPercentage = (value: number) => `${Math.round(value)}%`

  return (
    <div ref={dashboardRef} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pb-12">   {/* Header */}
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm md:text-base"
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
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
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
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Cognitive Profile */}
         <DashboardCard
            title="Cognitive Profile"
            icon={Brain}
            description="Distribution of cognitive abilities"
          >
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  data={Object.entries(reportData.metrics.cognitiveProfile)
                    .map(([name, value]) => ({ name, value: Math.round(value) }))}
                  margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
                >
                  <PolarGrid stroke={chartTheme.grid} />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ 
                      fill: chartTheme.text, 
                      fontSize: isMobile ? 10 : 12,
                      dy: isMobile ? 4 : 0
                    }}
                    tickFormatter={truncateLabel}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    fill={chartTheme.primary}
                    fillOpacity={0.3}
                    stroke={chartTheme.primary}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {!isMobile && <Legend wrapperStyle={{ paddingTop: 20 }} />}
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Learning Styles */}
          <DashboardCard
            title="Learning Styles"
            icon={Lightbulb}
            description="Preferred learning methods"
          >
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
              
<BarChart 
  data={reportData.metrics.learningStyles.map(style => ({
    ...style,
    value: Math.round(style.value)
  }))}
  margin={{ 
    top: 20, 
    right: 30, 
    bottom: isMobile ? 80 : 60, // Increased bottom margin (line 1)
    left: 30 
  }}
  barSize={isMobile ? 24 : 32}
>
  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
  <XAxis 
    dataKey="name" 
    tick={{ 
      fill: chartTheme.text, 
      fontSize: isMobile ? 8 : 10,
    }}
    axisLine={{ stroke: chartTheme.grid }}
    interval={0}
    angle={isMobile ? -90 : -45} // More vertical angle for mobile (line 2)
    textAnchor={isMobile ? 'middle' : 'end'} // Better text alignment (line 3)
    tickFormatter={truncateLabel} // Added label truncation (line 4)
    height={isMobile ? 80 : 60} // Explicit height allocation (line 5)
  />
  <YAxis 
    tickFormatter={formatPercentage}
    tick={{ fill: chartTheme.text, fontSize: 12 }}
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
            title="Career Interests"
            icon={Briefcase}
            description="Student career preferences"
            className="lg:col-span-2"
          >
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={reportData.metrics.careerDistribution.map(career => ({
                    ...career,
                    value: Math.round(career.value)
                  }))}
                  margin={{ 
                    top: 20, 
                    right: 30, 
                    bottom: isMobile ? 60 : 30, 
                    left: 30 
                  }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ 
                      fill: chartTheme.text, 
                      fontSize: isMobile ? 10 : 12 
                    }}
                    axisLine={{ stroke: chartTheme.grid }}
                    tickFormatter={truncateLabel}
                    interval={isMobile ? 'preserveStart' : 0}
                  />
                  <YAxis 
                    tickFormatter={formatPercentage}
                    tick={{ fill: chartTheme.text, fontSize: 12 }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={chartTheme.primary}
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
            className="lg:col-span-2"
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
                    className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-all border border-blue-100"
                  >
                    <h3 className="font-semibold text-blue-700 mb-2">{strength.title}</h3>
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
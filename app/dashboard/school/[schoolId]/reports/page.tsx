'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast } from 'sonner'
import {
  Brain,
  Users,
  Lightbulb,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Download
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

const cardStyle: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 }
const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--surface)', padding: 12, borderRadius: 12, boxShadow: '0 8px 24px rgba(22,33,31,0.12)', border: '1px solid var(--border-c)' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--muted)' }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: entry.color || '#0E9384', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{Math.round(entry.value)}%</span>
          </div>
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

  return <span style={{ fontVariantNumeric: 'tabular-nums' }}>{count.toLocaleString()}</span>
}

const DashboardCard: React.FC<{
  title: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  children: React.ReactNode
  description?: string
  style?: React.CSSProperties
}> = ({ title, icon: Icon, children, description, style }) => (
  <div style={{ ...cardStyle, ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
        <Icon size={20} />
      </span>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: 0 }}>{title}</h2>
        {description && <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '2px 0 0' }}>{description}</p>}
      </div>
    </div>
    <div style={{ marginTop: 18 }}>{children}</div>
  </div>
)

const LoadingState: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 16 }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      style={{ width: 52, height: 52, border: '4px solid var(--tint)', borderTopColor: 'var(--pri)', borderRadius: '50%' }}
    />
    <p style={{ fontSize: 14, color: 'var(--muted)' }}>Loading dashboard data...</p>
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
    <div style={{ maxWidth: 560, margin: '32px auto 0', padding: 16, background: 'color-mix(in srgb, #C0453B 8%, transparent)', border: '1px solid color-mix(in srgb, #C0453B 30%, transparent)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, color: '#C0453B' }}>
      <AlertCircle size={18} />
      <span style={{ fontSize: 14 }}>{error}</span>
    </div>
  )
  if (!reportData) return (
    <div style={{ maxWidth: 560, margin: '32px auto 0', padding: 16, background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)' }}>
      <AlertCircle size={18} />
      <span style={{ fontSize: 14 }}>No report data found</span>
    </div>
  )

  const chartTheme = {
    grid: '#E4EAEA',
    text: '#5E6B6A',
    primary: '#0E9384',
    secondary: '#F1785F',
    background: '#F6F8F8',
    accent: '#3E9AE0'
  }
  const truncateLabel = (label: string) => {
    if (isMobile && label.length > 8) return `${label.substring(0, 6)}...`
    return label
  }

  const formatPercentage = (value: number) => `${Math.round(value)}%`

  return (
    <div ref={dashboardRef} style={{ background: 'var(--canvas)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>{reportData.schoolInfo.name}</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Analytics dashboard</p>
        </div>
        <button
          onClick={downloadAsPDF}
          disabled={exporting}
          className="ng-btn-primary"
          style={{ height: 42, padding: '0 18px', background: 'var(--pri)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: exporting ? 'not-allowed' : 'pointer', opacity: exporting ? 0.6 : 1, display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit' }}
        >
          {exporting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.5)', borderTopColor: '#fff', borderRadius: '50%' }}
              />
              Generating PDF...
            </>
          ) : (
            <>
              <Download size={16} />
              Download report
            </>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
        {/* Stats Overview */}
        <div className="ng-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ ...cardStyle, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: tint('#0E9384'), color: '#0E9384', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <Users size={20} />
              </span>
              <div>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>Total students</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', margin: '2px 0 0', lineHeight: 1 }}>
                  <AnimatedCounter value={reportData.schoolInfo.totalStudents} />
                </p>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: tint('#9B5DE5'), color: '#9B5DE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <Brain size={20} />
              </span>
              <div>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0 }}>Average performance</p>
                <p style={{ fontSize: 24, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em', margin: '2px 0 0', lineHeight: 1 }}>
                  {Math.round(Object.values(reportData.metrics.cognitiveProfile)
                    .reduce((a, b) => a + b, 0) / Object.keys(reportData.metrics.cognitiveProfile).length)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
          {/* Cognitive Profile */}
          <DashboardCard
            title="Cognitive Profile"
            icon={Brain}
            description="Distribution of cognitive abilities"
          >
            <div style={{ height: 300, width: '100%' }}>
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
                    fillOpacity={0.25}
                    stroke={chartTheme.primary}
                    strokeWidth={2}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {!isMobile && <Legend wrapperStyle={{ paddingTop: 20, fontSize: 12, color: chartTheme.text }} />}
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
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={reportData.metrics.learningStyles.map(style => ({
                    ...style,
                    value: Math.round(style.value)
                  }))}
                  margin={{
                    top: 20,
                    right: 30,
                    bottom: isMobile ? 80 : 60,
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
                    angle={isMobile ? -90 : -45}
                    textAnchor={isMobile ? 'middle' : 'end'}
                    tickFormatter={truncateLabel}
                    height={isMobile ? 80 : 60}
                  />
                  <YAxis
                    tickFormatter={formatPercentage}
                    tick={{ fill: chartTheme.text, fontSize: 12 }}
                    axisLine={{ stroke: chartTheme.grid }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--tint)' }} />
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
            style={isMobile ? undefined : { gridColumn: 'span 2' }}
          >
            <div style={{ height: 400, width: '100%' }}>
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
                      <stop offset="5%" stopColor={chartTheme.primary} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartTheme.primary} stopOpacity={0} />
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
            style={isMobile ? undefined : { gridColumn: 'span 2' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
              <AnimatePresence>
                {reportData.metrics.strengths.map((strength, index) => {
                  const pct = Math.round((strength.count / reportData.schoolInfo.totalStudents) * 100)
                  return (
                    <motion.div
                      key={strength.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.3,
                        ease: 'easeOut'
                      }}
                      style={{ padding: 18, background: 'var(--tint)', borderRadius: 14, border: '1px solid var(--border-c)' }}
                    >
                      <h3 style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--pri)', margin: '0 0 10px' }}>{strength.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 8, background: 'color-mix(in srgb, var(--pri) 18%, transparent)', borderRadius: 999, overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            style={{ height: '100%', background: 'var(--pri)', borderRadius: 999 }}
                          />
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--pri)', fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '10px 0 0' }}>
                        {strength.count.toLocaleString()} students
                      </p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default SchoolPsychometricDashboard

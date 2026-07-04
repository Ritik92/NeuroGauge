'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const BrandMark = ({ size = 19 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8.5 5v10L12 22 3.5 17V7z" /><path d="M7 12h3l1.5-3 2 6 1.5-3h1.5" />
  </svg>
)

const roleConfigs: Record<string, { path: string; label: string; icon: React.ReactNode }> = {
  SYSTEM_ADMIN: {
    path: '/dashboard/admin', label: 'System Administrator',
    icon: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
  },
  SCHOOL_ADMIN: {
    path: '/dashboard/school', label: 'School Administrator',
    icon: <><path d="M3 21h18" /><path d="M5 21V8l7-4 7 4v13" /><path d="M9 21v-6h6v6" /></>,
  },
  STUDENT: {
    path: '/dashboard/student', label: 'Student',
    icon: <><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" /></>,
  },
  PARENT: {
    path: '/dashboard/parent', label: 'Parent',
    icon: <><path d="M16 20v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" /><circle cx="9" cy="8" r="3" /><path d="M20 20v-1a4 4 0 0 0-3-3.85" /><path d="M15 5.15A3 3 0 0 1 15 11" /></>,
  },
}

export default function AuthRouter() {
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }
    const roleConfig = roleConfigs[(session.user as any).role]
    if (roleConfig) {
      const timeout = setTimeout(() => router.push(roleConfig.path), 2000)
      return () => clearTimeout(timeout)
    }
  }, [session, router])

  if (!session) return null

  const roleConfig = roleConfigs[(session.user as any).role]
  const displayName = (session.user as any)?.name || session.user?.email

  return (
    <div className="ng" style={{ minHeight: '100dvh', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 'calc(var(--rad-card) + 4px)', boxShadow: 'var(--shadow-hover)', padding: '44px 40px', textAlign: 'center', width: '100%', maxWidth: 400 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--tint)', color: 'var(--pri)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><BrandMark /></span>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>NeuroGauge</span>
        </div>

        <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--tint)', color: 'var(--pri)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '34px auto 0', animation: 'ng-pulse 2s ease-in-out infinite' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{roleConfig?.icon}</svg>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '28px 0 0' }}>Welcome, {displayName}</h1>
        <p style={{ fontSize: 14.5, color: 'var(--muted)', margin: '8px 0 0' }}>Accessing your {roleConfig?.label ?? ''} dashboard</p>

        <div style={{ height: 6, borderRadius: 999, background: 'var(--border-c)', overflow: 'hidden', marginTop: 28 }}>
          <div style={{ height: '100%', borderRadius: 999, background: 'var(--pri)', animation: 'ng-load 1.8s ease-out forwards' }} />
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: '14px 0 0' }}>Preparing your dashboard…</p>
      </div>
    </div>
  )
}

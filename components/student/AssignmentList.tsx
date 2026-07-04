'use client'

import Link from "next/link"

interface Assignment {
  id: string
  title: string
  description: string
  type: 'PERSONALITY' | 'APTITUDE' | 'INTEREST' | 'LEARNING_STYLE'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  completed?: boolean
}

const Ico = ({ children, size = 22 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

const typeMeta: Record<Assignment['type'], { label: string; color: string; icon: React.ReactNode }> = {
  PERSONALITY: { label: 'Personality', color: '#9B5DE5', icon: <><path d="M12 5a3 3 0 0 0-6 .2 3 3 0 0 0-1.7 5.2A2.8 2.8 0 0 0 6 16a3 3 0 0 0 6 .5z" /><path d="M12 5a3 3 0 0 1 6 .2 3 3 0 0 1 1.7 5.2A2.8 2.8 0 0 1 18 16a3 3 0 0 1-6 .5z" /></> },
  APTITUDE: { label: 'Aptitude', color: '#0E9384', icon: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /></> },
  INTEREST: { label: 'Interest', color: '#F1785F', icon: <path d="M12 3l2.4 5.9 6.3.5-4.8 4.1 1.5 6.2L12 16.9 6.6 19.7l1.5-6.2L3.3 9.4l6.3-.5z" /> },
  LEARNING_STYLE: { label: 'Learning style', color: '#3E9AE0', icon: <><path d="M12 7v14" /><path d="M3 5h5a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2H3z" /><path d="M21 5h-5a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2H21z" /></> },
}
const tint = (c: string) => `color-mix(in srgb, ${c} 13%, transparent)`

export function AssignmentList({ assignments }: { assignments: Assignment[] }) {
  if (!assignments.length) {
    return <div style={{ color: 'var(--muted)', fontSize: 14 }}>No assignments available for your grade yet.</div>
  }
  return (
    <div className="ng-grid-3">
      {assignments.map((a) => {
        const m = typeMeta[a.type] || typeMeta.APTITUDE
        const done = !!a.completed
        return (
          <Link key={a.id} href={`/dashboard/student/assignments/${a.id}`} className="ng-lift" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22, textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tint(m.color), color: m.color }}><Ico>{m.icon}</Ico></span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: done ? '#1F8A5B' : '#2F6FB0', background: done ? tint('#1F8A5B') : tint('#2F6FB0'), padding: '4px 10px', borderRadius: 999 }}>{done ? 'Completed' : 'Not started'}</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '16px 0 0' }}>{a.title}</h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)', margin: '7px 0 0', flex: 1 }}>{a.description}</p>
            <div style={{ marginTop: 18, height: 40, borderRadius: 10, border: done ? '1px solid var(--border-c)' : 'none', background: done ? 'var(--surface)' : 'var(--pri)', color: done ? 'var(--ink)' : '#fff', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {done ? 'View again' : 'Start assessment'}
              <Ico size={16}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></Ico>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

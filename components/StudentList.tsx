'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Users, GraduationCap } from 'lucide-react';
import axios from 'axios';

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  grade: number
  dateOfBirth: string
}

const card: React.CSSProperties = { background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 22 };
const th: React.CSSProperties = { textAlign: 'left', fontSize: 11.5, fontWeight: 600, color: 'var(--muted)', padding: '11px 16px', textTransform: 'uppercase', letterSpacing: '0.03em', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { fontSize: 13.5, color: 'var(--ink)', padding: '14px 16px' };
const chipTeal: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#0E9384', background: 'color-mix(in srgb, #0E9384 13%, transparent)', padding: '4px 10px', borderRadius: 999, whiteSpace: 'nowrap' };

function Bar({ w }: { w: number }) {
  return <div style={{ height: 12, width: w, borderRadius: 6, background: 'color-mix(in srgb, var(--muted) 16%, transparent)', animation: 'ng-pulse 1.4s ease-in-out infinite' }} />;
}

export default function StudentsList() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedGrade, setSelectedGrade] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return

    const fetchStudents = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/students', {
          params: {
            userId,
            grade: selectedGrade === 'all' ? null : selectedGrade
          }
        })
        setStudents(response.data)
      } catch (err) {
        setError('Failed to fetch students')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [userId, selectedGrade])

  if (!userId) {
    return <div style={{ fontSize: 14, color: 'var(--muted)', padding: 8 }}>No school assigned</div>
  }

  if (error) {
    return <div style={{ fontSize: 14, color: '#C0453B', padding: 8 }}>{error}</div>
  }

  return (
    <div>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>Student directory</h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>Manage and view all student records</p>
        </div>

        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 42, padding: '0 14px', background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 10, color: 'var(--ink)' }}>
          <GraduationCap size={16} style={{ color: 'var(--pri)' }} />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            style={{ appearance: 'none', border: 'none', background: 'transparent', color: 'var(--ink)', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}
          >
            <option value="all">All grades</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <option key={grade} value={grade.toString()}>Grade {grade}</option>
            ))}
          </select>
        </label>
      </div>

      {/* table card */}
      <div style={{ ...card, padding: 0, overflow: 'hidden', marginTop: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--border-c)' }}>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Grade</th>
                <th style={th}>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} style={{ borderTop: index !== 0 ? '1px solid var(--border-c)' : 'none' }}>
                    <td style={td}><Bar w={120} /></td>
                    <td style={td}><Bar w={200} /></td>
                    <td style={td}><Bar w={50} /></td>
                    <td style={td}><Bar w={100} /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--muted)' }}>
                      <Users size={30} />
                      <p style={{ fontSize: 14, margin: 0 }}>No students found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, index) => (
                  <tr key={student.id} style={{ borderTop: '1px solid var(--border-c)' }}>
                    <td style={{ ...td, fontWeight: 600 }}>{student.firstName} {student.lastName}</td>
                    <td style={{ ...td, color: 'var(--muted)' }}>{student.email}</td>
                    <td style={td}>
                      <span style={chipTeal}>
                        <GraduationCap size={13} />
                        Grade {student.grade}
                      </span>
                    </td>
                    <td style={{ ...td, color: 'var(--muted)' }}>{student.dateOfBirth}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

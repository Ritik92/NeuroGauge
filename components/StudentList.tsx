// components/StudentsList.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  grade: number
  dateOfBirth: string
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
    return <div>No school assigned</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
              <SelectItem key={grade} value={grade.toString()}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Date of Birth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
                <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              </TableRow>
            ))
          ) : students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No students found
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <motion.tr
                key={student.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TableCell>{student.firstName} {student.lastName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>Grade {student.grade}</TableCell>
                <TableCell>{student.dateOfBirth}</TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
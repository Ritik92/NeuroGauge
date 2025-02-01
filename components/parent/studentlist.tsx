'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getParentStudents, getStudentReportsForParent } from '@/lib/actions/parent';
import { Button } from '@/components/ui/moving-border';
import Link from 'next/link';
import { StudentReportList } from './student-report-list';
interface Student {
    id: string;
    firstName: string;
    lastName: string;
    grade: number;
  }
  
  export function StudentsList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
    useEffect(() => {
      const loadStudents = async () => {
        const res = await getParentStudents();
        setStudents(res || []);
        setLoading(false);
      };
      loadStudents();
    }, []);
  
    if (loading) return <StudentsListSkeleton />;
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {students.map((student) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card>
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedStudent(
                  expandedStudent === student.id ? null : student.id
                )}
              >
                <CardTitle>{student.firstName} {student.lastName}</CardTitle>
                <CardDescription>Grade {student.grade}</CardDescription>
              </CardHeader>
              {expandedStudent === student.id && (
                <CardContent>
                  <StudentReportList studentId={student.id} />
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }
  function StudentsListSkeleton() {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
        ))}
      </div>
    );
  }
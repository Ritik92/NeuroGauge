// components/school-reports.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface SchoolReport {
  id: string;
  type: 'GRADE_WISE' | 'YEARLY';
  data: any;
  createdAt: string;
}

export function SchoolReports({ schoolId }: { schoolId: string }) {
  const [reports, setReports] = useState<SchoolReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`/api/schools/${schoolId}/reports`);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {reports.map((report) => (
        <motion.div
          key={report.id}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {report.type === 'GRADE_WISE' ? 'Grade-wise Report' : 'Yearly Report'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.type === 'GRADE_WISE' ? (
                <GradeWiseReport data={report.data} />
              ) : (
                <YearlyReport data={report.data} />
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function GradeWiseReport({ data }: { data: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Students" value={data.totalStudents} />
        <StatCard label="Math Average" value={data.averageScores.math} />
        <StatCard label="Science Average" value={data.averageScores.science} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Average Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(data.averageScores).map(([subject, score]) => (
            <TableRow key={subject}>
              <TableCell className="font-medium">{subject}</TableCell>
              <TableCell className="text-right">{score as number}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function YearlyReport({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatCard label="Graduation Rate" value={`${data.graduationRate}%`} />
      <StatCard label="College Acceptance" value={`${data.collegeAcceptance}%`} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
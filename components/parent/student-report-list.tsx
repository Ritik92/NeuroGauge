'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getParentStudents, getStudentReportsForParent } from '@/lib/actions/parent';
import { Button } from '@/components/ui/moving-border';
import Link from 'next/link';
interface Report {
    id: string;
    createdAt: string;
  }
  
  export function StudentReportList({ studentId }: { studentId: string }) {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const loadReports = async () => {
        const res = await getStudentReportsForParent(studentId);
        //@ts-ignore
        setReports(res || []);
        setLoading(false);
      };
      loadReports();
    }, [studentId]);
  
    if (loading) return <ReportSkeleton />;
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {reports.map((report) => (
          <motion.div
            key={report.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Report #{reports.indexOf(report) + 1}</CardTitle>
                <CardDescription>
                  {new Date(report.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href={`/dashboard/parent/reports/${report.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }
  
  function ReportSkeleton() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
        ))}
      </div>
    );
  }
  
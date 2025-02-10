'use client'
import ReportInterface from "@/components/report-interface";
import { getStudentDetail } from "@/lib/actions/getstudentdetail";
import { getStudentReport } from "@/lib/actions/report";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { use } from 'react';
export default function ReportPage({ params }: { params: { id: string } }) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [student, setStudent] = useState<any>(null);
    const [report, setReport] = useState<any>(null);
    const resolvedParams = use(params);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const studentData = await getStudentDetail(userId);
                console.log('This is Student Data', studentData);
                const reportData = await getStudentReport(resolvedParams.id);
                setStudent(studentData.student);
                setReport(reportData);
            }
        };
        
        fetchData();
    }, [userId, resolvedParams.id]);
  if (!report) return <div className="text-blue-600 flex justify-center items-center">Loading...</div>;
  return (
    <div className="container py-12">
      <ReportInterface demoData={report.data} student={student}/>
    </div>
  );
}
'use client'

import ReportInterface from "@/components/report-interface";
import { getStudentDetail } from "@/lib/actions/getstudentdetail";
import { getStudentReport } from "@/lib/actions/report";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ReportPage({ params }: any) {
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [student, setStudent] = useState<any>(null);
    const [report, setReport] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const studentData = await getStudentDetail(userId);
                const reportData = await getStudentReport(params.id);
                setStudent(studentData.student);
                setReport(reportData);
            }
        };
        
        fetchData();
    }, [userId, params.id]);

    if (!report) return <div className="text-blue-600 flex justify-center items-center">Loading...</div>;

    return (
        <div className="container py-12">
         
            <ReportInterface demoData={report.data} student={student} />
        </div>
    );
}
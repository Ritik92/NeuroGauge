'use client'

import ReportInterface from "@/components/report-interface";
import { getParentReport } from "@/lib/actions/report";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ParentReportPage() {
  const params = useParams<any>();
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // getParentReport verifies this parent owns the student and returns
        // the report together with the student record.
        const reportData = await getParentReport(params.id);
        setReport(reportData);
      } catch (e) {
        setError(true);
      }
    };
    fetchData();
  }, [params.id]);

  if (error) {
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don&apos;t have permission to view this report.
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-blue-600 flex justify-center items-center py-12">
        Loading...
      </div>
    );
  }

  return (
    <div className="container py-12">
      <ReportInterface demoData={report.data} student={report.student} />
    </div>
  );
}

// app/dashboard/parent/reports/[id]/page.tsx
import { getParentReport } from "@/lib/actions/report";
import { ReportInterface } from "@/components/report-interface";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ParentReportPage({ params }: any) {
  try {
    const report = await getParentReport(params.id);
    if (!report) return notFound();

    return (
      <div className="container py-12">
        <ReportInterface report={report} />
      </div>
    );
  } catch (error) {
    // If there's an authorization error or other issues
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to view this report.
          </p>
        </div>
      </div>
    );
  }
}
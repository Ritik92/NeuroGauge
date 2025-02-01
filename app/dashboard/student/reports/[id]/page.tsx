import ReportInterface from "@/components/report-interface";
import { getStudentReport } from "@/lib/actions/report";


interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ReportPage({ params }: any) {
  const report = await getStudentReport(params.id);
  if (!report) return <div>Report not found</div>;
  return (
    <div className="container py-12">
      <ReportInterface />
    </div>
  );
}
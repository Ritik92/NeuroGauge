import { getStudentReport } from "@/app/actions/report";
import { ReportInterface } from "@/components/report-interface";


export default async function ReportPage({
  params
}: {
  params: { id: string };
}) {
  const report = await getStudentReport(params.id);

  if (!report) return <div>Report not found</div>;

  return (
    <div className="container py-12">
      <ReportInterface report={report} />
    </div>
  );
}
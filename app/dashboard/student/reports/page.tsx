import { ReportList } from "@/components/student-report";


export default function ReportsPage() {
  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Your Reports</h1>
          <p className="text-muted-foreground">
            View all your generated assessment reports
          </p>
        </div>
        <ReportList />
      </div>
    </div>
  );
}
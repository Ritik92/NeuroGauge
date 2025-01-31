// ReportInterface.tsx
'use client';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export function ReportInterface({ report }: { report: any }) {
  const reportData = report.data as {
    strengths: string[];
    recommendations: string[];
    personalityType: string;
    averageScore: number;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8 p-4"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Student Assessment Report</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="outline" className="text-sm">
            Generated: {new Date(report.createdAt).toLocaleDateString()}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Personality: {reportData.personalityType}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Average Score: {reportData.averageScore}%
          </Badge>
        </div>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Strengths Card */}
        <Card>
          <CardHeader>
            <CardTitle>Key Strengths</CardTitle>
            <CardDescription>Primary student competencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reportData.strengths.map((strength, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                <span className="font-medium">{strength}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Average Score Card */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>Overall average score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {reportData.averageScore}%
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2" 
                  style={{ width: `${reportData.averageScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Based on overall academic performance across subjects
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Suggested next steps for development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {reportData.recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="ml-4">
                    <p className="font-medium">{rec}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getRecommendationDescription(rec)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Helper function for recommendation descriptions
function getRecommendationDescription(recommendation: string): string {
  const descriptions: { [key: string]: string } = {
    'Advanced courses': 'Challenging coursework to expand knowledge boundaries',
    'Tutoring': 'Personalized support in areas needing improvement',
    'Extracurricular activities': 'Develop skills through practical experiences',
    'Mentorship': 'Guidance from experienced professionals in field of interest'
  };
  return descriptions[recommendation] || 'Custom development plan';
}
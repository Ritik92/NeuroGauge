// ReportInterface.tsx
'use client';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ReportInterface({ report }: { report: any }) {
  const reportData = report.data as any; // Adjust the type according to your report structure

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Assessment Report</h1>
        <div className="flex gap-2 items-center">
          <Badge variant="outline">
            Generated: {new Date(report.createdAt).toLocaleDateString()}
          </Badge>
          <Badge variant="secondary">
            {reportData?.type || 'Comprehensive Analysis'}
          </Badge>
        </div>
      </div>

      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="space-y-6"
      >
        {reportData?.personalityTraits && (
          <Card>
            <CardHeader>
              <CardTitle>Personality Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(reportData.personalityTraits).map(([trait, score]) => (
                    <TableRow key={trait}>
                      <TableCell className="font-medium">{trait}</TableCell>
                      <TableCell className="w-[100px] text-right">
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full" 
                            style={{ width: `${(Number(score) / 5) * 100}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {reportData?.learningStyle && (
          <Card>
            <CardHeader>
              <CardTitle>Learning Style Analysis</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              {Object.entries(reportData.learningStyle).map(([style, score]) => (
                <div key={style} className="text-center">
                  {/* <div className="text-2xl font-bold">{score}</div> */}
                  <div className="text-sm text-muted-foreground">{style}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {reportData?.recommendations && (
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reportData.recommendations.map((rec: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                  <p className="text-sm leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
// ReportInterface.tsx
'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain, Target, Book, Users, Star, TrendingUp, MessageCircle, HeartPulse } from 'lucide-react';

const demoData = {
  studentInfo: {
    name: "Alex Thompson",
    grade: "10th Grade",
    age: 15,
    assessmentDate: "2025-01-28",
    personalityType: "INTP - The Thinker",
    overallPercentile: 92
  },
  cognitiveProfile: {
    analyticalThinking: 95,
    creativeReasoning: 88,
    problemSolving: 90,
    memoryRecall: 85,
    spatialVisualization: 92,
    verbalComprehension: 87
  },
  learningStyle: {
    primary: "Visual-Spatial",
    secondary: "Logical-Mathematical",
    characteristics: [
      "Excels in visual information processing",
      "Strong pattern recognition abilities",
      "Prefers systematic learning approaches",
      "High capacity for abstract reasoning"
    ]
  },
  strengths: [
    {
      title: "Complex Problem Analysis",
      description: "Exceptional ability to break down and solve multi-step problems",
      score: 95
    },
    {
      title: "Pattern Recognition",
      description: "Strong capability in identifying underlying patterns and relationships",
      score: 92
    },
    {
      title: "Abstract Reasoning",
      description: "Advanced capacity for theoretical and conceptual thinking",
      score: 90
    }
  ],
  recommendations: [
    {
      title: "Advanced Mathematics Track",
      description: "Consider enrollment in advanced calculus and statistics courses",
      icon: <Book className="w-5 h-5" />
    },
    {
      title: "Science Research Program",
      description: "Participate in the school's advanced research program",
      icon: <Brain className="w-5 h-5" />
    },
    {
      title: "Peer Tutoring",
      description: "Lead study groups in mathematics and sciences",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Programming Club",
      description: "Join the coding club to apply logical thinking skills",
      icon: <Target className="w-5 h-5" />
    }
  ],
  developmentAreas: [
    "Verbal expression of complex ideas",
    "Group collaboration skills",
    "Time management in open-ended projects"
  ]
};

const ReportInterface = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 space-y-8"
    >
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cognitive Assessment Report
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50">
            {demoData.studentInfo.name}
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {demoData.studentInfo.grade}
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            {demoData.studentInfo.personalityType}
          </Badge>
          <Badge variant="outline" className="bg-blue-50">
            Assessment Date: {new Date(demoData.studentInfo.assessmentDate).toLocaleDateString()}
          </Badge>
        </div>
      </div>

      {/* Cognitive Profile Section */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Cognitive Profile</CardTitle>
          <CardDescription>Comprehensive analysis of cognitive abilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(demoData.cognitiveProfile).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm font-bold text-blue-600">{value}%</span>
              </div>
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Style & Strengths */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-600" />
              <span>Learning Style</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-600">Primary: {demoData.learningStyle.primary}</p>
              <p className="text-sm text-gray-600">Secondary: {demoData.learningStyle.secondary}</p>
            </div>
            <div className="space-y-2">
              {demoData.learningStyle.characteristics.map((char, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <span className="text-sm">{char}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Key Strengths</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoData.strengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-blue-50 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-600">{strength.title}</span>
                    <Badge variant="secondary">{strength.score}%</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{strength.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span>Personalized Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {demoData.recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border-2 border-blue-100 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {rec.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Areas */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            <span>Development Areas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {demoData.developmentAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-blue-50 rounded-lg text-center"
              >
                <p className="text-sm text-blue-600 font-medium">{area}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportInterface;
// 'use client';
// import { motion } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

// export function ReportInterface({ report }: { report: any }) {
//   const reportData = report.data as {
//     strengths: string[];
//     recommendations: string[];
//     personalityType: string;
//     averageScore: number;
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-4xl mx-auto space-y-8 p-4"
//     >
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold">Student Assessment Report</h1>
//         <div className="flex flex-wrap gap-2 items-center">
//           <Badge variant="outline" className="text-sm">
//             Generated: {new Date(report.createdAt).toLocaleDateString()}
//           </Badge>
//           <Badge variant="secondary" className="text-sm">
//             Personality: {reportData.personalityType}
//           </Badge>
//           <Badge variant="secondary" className="text-sm">
//             Average Score: {reportData.averageScore}%
//           </Badge>
//         </div>
//       </div>

//       <motion.div
//         initial={{ y: 20 }}
//         animate={{ y: 0 }}
//         className="grid gap-6 md:grid-cols-2"
//       >
//         {/* Strengths Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Key Strengths</CardTitle>
//             <CardDescription>Primary student competencies</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             {reportData.strengths.map((strength, index) => (
//               <div key={index} className="flex items-start space-x-2">
//                 <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
//                 <span className="font-medium">{strength}</span>
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Average Score Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Academic Performance</CardTitle>
//             <CardDescription>Overall average score</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="text-4xl font-bold text-primary">
//                 {reportData.averageScore}%
//               </div>
//               <div className="w-full bg-gray-100 rounded-full h-2">
//                 <div 
//                   className="bg-primary rounded-full h-2" 
//                   style={{ width: `${reportData.averageScore}%` }}
//                 />
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 Based on overall academic performance across subjects
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recommendations Card */}
//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Personalized Recommendations</CardTitle>
//             <CardDescription>Suggested next steps for development</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-2">
//               {reportData.recommendations.map((rec, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="flex items-start p-4 bg-muted/50 rounded-lg"
//                 >
//                   <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
//                   <div className="ml-4">
//                     <p className="font-medium">{rec}</p>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {getRecommendationDescription(rec)}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </motion.div>
//   );
// }

// // Helper function for recommendation descriptions
// function getRecommendationDescription(recommendation: string): string {
//   const descriptions: { [key: string]: string } = {
//     'Advanced courses': 'Challenging coursework to expand knowledge boundaries',
//     'Tutoring': 'Personalized support in areas needing improvement',
//     'Extracurricular activities': 'Develop skills through practical experiences',
//     'Mentorship': 'Guidance from experienced professionals in field of interest'
//   };
//   return descriptions[recommendation] || 'Custom development plan';
// }
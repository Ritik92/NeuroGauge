// 'use client'
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';
// import { Progress } from '@/components/ui/progress';
// import { Textarea } from '@/components/ui/textarea';

// const questions = [
//   // Cognitive Abilities
//   {
//     id: 'analytical_thinking',
//     type: 'LIKERT_SCALE',
//     text: 'When faced with complex problems, I systematically analyze all components before making decisions.',
//     category: 'Analytical Thinking'
//   },
//   {
//     id: 'cognitive_flexibility',
//     type: 'MULTIPLE_CHOICE',
//     text: 'When presented with conflicting information, I typically:',
//     category: 'Cognitive Flexibility',
//     options: [
//       { id: 'cf1', text: 'Seek additional data to resolve contradictions', value: 'data-driven' },
//       { id: 'cf2', text: 'Consider multiple perspectives simultaneously', value: 'integrative' },
//       { id: 'cf3', text: 'Re-examine my initial assumptions', value: 'reflective' },
//       { id: 'cf4', text: 'Focus on the most credible source', value: 'selective' }
//     ]
//   },
//   {
//     id: 'metacognition',
//     type: 'OPEN_ENDED',
//     text: 'Describe a time when you had to adjust your learning strategy to master a new skill.',
//     category: 'Metacognition'
//   },

//   // Emotional Intelligence
//   {
//     id: 'emotional_awareness',
//     type: 'LIKERT_SCALE',
//     text: 'I can accurately identify my emotions as they occur in different situations.',
//     category: 'Emotional Awareness'
//   },
//   {
//     id: 'empathy',
//     type: 'OPEN_ENDED',
//     text: 'Describe how you would respond to a colleague who seems upset but hasn\'t shared why.',
//     category: 'Empathy'
//   },

//   // Personality Factors
//   {
//     id: 'resilience',
//     type: 'LIKERT_SCALE',
//     text: 'Setbacks typically motivate me to try different approaches rather than discourage me.',
//     category: 'Resilience'
//   },
//   {
//     id: 'risk_tolerance',
//     type: 'MULTIPLE_CHOICE',
//     text: 'When facing uncertain outcomes, I tend to:',
//     category: 'Risk Tolerance',
//     options: [
//       { id: 'rt1', text: 'Calculate probabilities carefully', value: 'calculated' },
//       { id: 'rt2', text: 'Follow my intuition', value: 'intuitive' },
//       { id: 'rt3', text: 'Seek expert advice', value: 'collaborative' },
//       { id: 'rt4', text: 'Avoid unnecessary risks', value: 'cautious' }
//     ]
//   },

//   // Social Cognition
//   {
//     id: 'social_awareness',
//     type: 'OPEN_ENDED',
//     text: 'Describe a situation where understanding someone else perspective changed your approach to a problem.',
//     category: 'Social Awareness'
//   },
//   {
//     id: 'conflict_resolution',
//     type: 'MULTIPLE_CHOICE',
//     text: 'In team disagreements, I most often:',
//     category: 'Conflict Resolution',
//     options: [
//       { id: 'cr1', text: 'Facilitate compromise', value: 'mediator' },
//       { id: 'cr2', text: 'Advocate for optimal solution', value: 'optimizer' },
//       { id: 'cr3', text: 'Ensure all voices are heard', value: 'inclusive' },
//       { id: 'cr4', text: 'Focus on shared goals', value: 'unifier' }
//     ]
//   },

//   // Executive Functioning
//   {
//     id: 'task_prioritization',
//     type: 'LIKERT_SCALE',
//     text: 'I consistently adjust my priorities effectively when dealing with multiple deadlines.',
//     category: 'Task Prioritization'
//   },
//   {
//     id: 'impulse_control',
//     type: 'OPEN_ENDED',
//     text: 'Describe a recent situation where you had to delay immediate gratification for a long-term goal.',
//     category: 'Impulse Control'
//   },

//   // Creativity & Innovation
//   {
//     id: 'divergent_thinking',
//     type: 'LIKERT_SCALE',
//     text: 'I frequently generate multiple solutions to a single problem.',
//     category: 'Divergent Thinking'
//   },
//   {
//     id: 'innovation_response',
//     type: 'MULTIPLE_CHOICE',
//     text: 'When encountering established processes, I typically:',
//     category: 'Innovation Response',
//     options: [
//       { id: 'ir1', text: 'Look for improvement opportunities', value: 'optimizer' },
//       { id: 'ir2', text: 'Master existing systems first', value: 'systemic' },
//       { id: 'ir3', text: 'Combine different approaches', value: 'integrative' },
//       { id: 'ir4', text: 'Challenge fundamental assumptions', value: 'disruptive' }
//     ]
//   }
// ];

// export default function AssessmentInterface({ assessment }: { assessment: any }) {
//   const { register, handleSubmit, watch, formState } = useForm();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const onSubmit = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       window.location.href='/dashboard/student/reports'
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const currentQuestionData = questions[currentQuestion];
//   const progress = ((currentQuestion + 1) / questions.length) * 100;

//   const goToNext = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(prev => prev + 1);
//     }
//   };

//   const goToPrevious = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(prev => prev - 1);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-4xl mx-auto p-6 space-y-8"
//     >
//       {/* Header */}
//       <div className="flex items-center space-x-3 mb-8">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//         >
//           <Brain className="w-8 h-8 text-blue-600" />
//         </motion.div>
//         <div>
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//             Comprehensive Psychological Assessment
//           </h1>
//           <p className="text-gray-600">Evaluating Cognitive, Emotional, and Behavioral Patterns</p>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="space-y-2">
//         <div className="flex justify-between text-sm text-gray-600">
//           <span>Question {currentQuestion + 1} of {questions.length}</span>
//           <span>{Math.round(progress)}% Complete</span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Question Card */}
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <Card className="border-2 border-blue-100">
//           <CardHeader>
//             <CardTitle className="text-lg text-blue-600">
//               {currentQuestionData.category}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <p className="text-lg">{currentQuestionData.text}</p>

//             <div className="space-y-4">
//               {currentQuestionData.type === 'MULTIPLE_CHOICE' && (
//                 <div className="grid gap-4">
//                   {currentQuestionData.options?.map((option) => (
//                     <label
//                       key={option.id}
//                       className="flex items-center p-4 border-2 border-gray-100 rounded-lg hover:border-blue-200 transition-colors cursor-pointer"
//                     >
//                       <input
//                         type="radio"
//                         value={option.value}
//                         {...register(currentQuestionData.id)}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span className="ml-3">{option.text}</span>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {currentQuestionData.type === 'LIKERT_SCALE' && (
//                 <div className="grid grid-cols-5 gap-4 pt-4">
//                   {[1, 2, 3, 4, 5].map((value) => (
//                     <label key={value} className="flex flex-col items-center space-y-2">
//                       <input
//                         type="radio"
//                         value={value}
//                         {...register(currentQuestionData.id)}
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <span className="text-sm text-center">
//                         {value === 1 ? 'Strongly Disagree' :
//                          value === 2 ? 'Disagree' :
//                          value === 3 ? 'Neutral' :
//                          value === 4 ? 'Agree' :
//                          'Strongly Agree'}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               )}

//               {currentQuestionData.type === 'OPEN_ENDED' && (
//                 <Textarea
//                   {...register(currentQuestionData.id)}
//                   className="min-h-[120px] border-2 border-gray-100 focus:border-blue-200"
//                   placeholder="Type your response here..."
//                 />
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between mt-6">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={goToPrevious}
//             disabled={currentQuestion === 0}
//             className="flex items-center space-x-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Previous</span>
//           </Button>

//           {currentQuestion === questions.length - 1 ? (
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
//             >
//               <span>{isSubmitting ? 'Submitting...' : 'Complete Assessment'}</span>
//             </Button>
//           ) : (
//             <Button
//               type="button"
//               onClick={goToNext}
//               className="flex items-center space-x-2"
//             >
//               <span>Next</span>
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           )}
//         </div>
//       </form>
//     </motion.div>
//   );
// }
// AssessmentInterface.tsx
'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import ReportInterface from '../report-interface';
import { generateReport } from '@/lib/actions/generate-report-gemini';

// Define types based on your Prisma schema
type QuestionType = 'MULTIPLE_CHOICE' | 'LIKERT_SCALE' | 'OPEN_ENDED';
type AssessmentType = 'PERSONALITY' | 'APTITUDE' | 'INTEREST' | 'LEARNING_STYLE';

interface Option {
  id: string;
  text: string;
  value: string;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: Option[];
  orderIndex: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  gradeLevel: number[];
  type: AssessmentType;
  questions: Question[];
}

interface Response {
  questionId: string;
  value: string | number;
}

interface AssessmentInterfaceProps {
  assessment: Assessment;
}

interface FormValues {
  [key: string]: string | number;
}

export default function AssessmentInterface({ assessment }: any) {
  const { register, handleSubmit, formState } = useForm<FormValues>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [report, setReport] = useState<any>(null);

  const onSubmit = async (data: FormValues) => {
    const responses: Response[] = Object.entries(data).map(([questionId, value]) => ({
      questionId,
      value
    }));

    console.log(assessment);
    console.log(responses);

    try {
      const reportData = await generateReport(assessment, responses);
      console.log('Done', reportData);
      setReport(reportData);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (report) {
    return <ReportInterface demoData={report} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{assessment.title}</h1>
        <p className="text-muted-foreground">{assessment.description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {assessment.questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                Question {index + 1} of {assessment.questions.length}
              </h3>
              <p className="text-base">{question.text}</p>
            </div>

            {question.type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label key={option.id} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value={option.value}
                      {...register(question.id, { required: true })}
                      className="h-4 w-4"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'LIKERT_SCALE' && (
              <div className="grid grid-cols-5 gap-4 pt-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center space-y-2">
                    <input
                      type="radio"
                      value={value}
                      {...register(question.id, { required: true })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-center">
                      {value === 1
                        ? 'Strongly Disagree'
                        : value === 2
                        ? 'Disagree'
                        : value === 3
                        ? 'Neutral'
                        : value === 4
                        ? 'Agree'
                        : 'Strongly Agree'}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'OPEN_ENDED' && (
              <textarea
                {...register(question.id, { required: true })}
                className="w-full h-32 p-3 border rounded-lg"
              />
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="px-8 py-4 text-lg"
          >
            {formState.isSubmitting ? 'Submitting...' : 'Complete Assessment'}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}


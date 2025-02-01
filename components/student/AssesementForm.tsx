'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { submitAssessmentResponse } from '@/lib/actions/response';

const questions = [
  {
    id: 'analytical_thinking',
    type: 'LIKERT_SCALE',
    text: 'When faced with a complex problem, I prefer breaking it down into smaller, manageable parts.',
    category: 'Analytical Thinking'
  },
  {
    id: 'creative_reasoning',
    type: 'LIKERT_SCALE',
    text: 'I often come up with unique solutions to problems that others might not think of.',
    category: 'Creative Reasoning'
  },
  {
    id: 'problem_solving',
    type: 'MULTIPLE_CHOICE',
    text: 'When solving a puzzle, which approach do you typically take?',
    category: 'Problem Solving',
    options: [
      { id: 'ps1', text: 'Look for patterns immediately', value: 'patterns' },
      { id: 'ps2', text: 'Try different solutions systematically', value: 'systematic' },
      { id: 'ps3', text: 'Start with what worked in similar situations', value: 'experience' },
      { id: 'ps4', text: 'Visualize the entire problem first', value: 'visual' }
    ]
  },
  {
    id: 'memory_recall',
    type: 'LIKERT_SCALE',
    text: 'I can easily remember and recall details from something I read several days ago.',
    category: 'Memory Recall'
  },
  {
    id: 'spatial_visualization',
    type: 'MULTIPLE_CHOICE',
    text: 'When assembling furniture without instructions, I usually:',
    category: 'Spatial Visualization',
    options: [
      { id: 'sv1', text: 'Can visualize how pieces fit together easily', value: 'visualize' },
      { id: 'sv2', text: 'Need to physically try different combinations', value: 'physical' },
      { id: 'sv3', text: 'Prefer to look for similar examples first', value: 'reference' },
      { id: 'sv4', text: 'Find it challenging without clear steps', value: 'structured' }
    ]
  },
  {
    id: 'verbal_comprehension',
    type: 'LIKERT_SCALE',
    text: 'I can easily explain complex concepts to others in simple terms.',
    category: 'Verbal Comprehension'
  },
  {
    id: 'learning_style',
    type: 'MULTIPLE_CHOICE',
    text: 'When learning something new, I prefer:',
    category: 'Learning Style',
    options: [
      { id: 'ls1', text: 'Visual diagrams and charts', value: 'visual' },
      { id: 'ls2', text: 'Written explanations', value: 'verbal' },
      { id: 'ls3', text: 'Hands-on practice', value: 'kinesthetic' },
      { id: 'ls4', text: 'Logical step-by-step instructions', value: 'logical' }
    ]
  },
  {
    id: 'pattern_recognition',
    type: 'LIKERT_SCALE',
    text: 'I quickly notice patterns in information or data presented to me.',
    category: 'Pattern Recognition'
  },
  {
    id: 'abstract_reasoning',
    type: 'LIKERT_SCALE',
    text: 'I enjoy thinking about theoretical concepts and abstract ideas.',
    category: 'Abstract Reasoning'
  },
  {
    id: 'collaboration',
    type: 'MULTIPLE_CHOICE',
    text: 'In group projects, I typically:',
    category: 'Collaboration',
    options: [
      { id: 'c1', text: 'Take the lead naturally', value: 'leader' },
      { id: 'c2', text: 'Contribute ideas but prefer others to lead', value: 'contributor' },
      { id: 'c3', text: 'Focus on specific tasks assigned', value: 'specialist' },
      { id: 'c4', text: 'Adapt to whatever role is needed', value: 'flexible' }
    ]
  },
  {
    id: 'time_management',
    type: 'LIKERT_SCALE',
    text: 'I consistently complete tasks ahead of deadlines without rushing.',
    category: 'Time Management'
  },
  {
    id: 'decision_making',
    type: 'MULTIPLE_CHOICE',
    text: 'When making important decisions, I usually:',
    category: 'Decision Making',
    options: [
      { id: 'dm1', text: 'Analyze all available data', value: 'analytical' },
      { id: 'dm2', text: 'Trust my intuition', value: 'intuitive' },
      { id: 'dm3', text: 'Consider others opinions', value: 'collaborative' },
      { id: 'dm4', text: 'Follow established procedures', value: 'structured' }
    ]
  },
  {
    id: 'stress_management',
    type: 'LIKERT_SCALE',
    text: 'I maintain focus and productivity even under pressure.',
    category: 'Stress Management'
  },
  {
    id: 'innovation',
    type: 'LIKERT_SCALE',
    text: 'I often suggest new approaches to improve existing processes.',
    category: 'Innovation'
  },
  {
    id: 'adaptability',
    type: 'LIKERT_SCALE',
    text: 'I adjust quickly to unexpected changes in plans or situations.',
    category: 'Adaptability'
  }
];

export default function AssessmentInterface({ assessment }: { assessment: any }) {
  const { register, handleSubmit, watch, formState } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      window.location.href='/dashboard/student/reports'
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="w-8 h-8 text-blue-600" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Cognitive Assessment
          </h1>
          <p className="text-gray-600">Understanding Your Cognitive Profile</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">
              {currentQuestionData.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg">{currentQuestionData.text}</p>

            <div className="space-y-4">
              {currentQuestionData.type === 'MULTIPLE_CHOICE' && (
                <div className="grid gap-4">
                  {currentQuestionData.options?.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center p-4 border-2 border-gray-100 rounded-lg hover:border-blue-200 transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register(currentQuestionData.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3">{option.text}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestionData.type === 'LIKERT_SCALE' && (
                <div className="grid grid-cols-5 gap-4 pt-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="flex flex-col items-center space-y-2">
                      <input
                        type="radio"
                        value={value}
                        {...register(currentQuestionData.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-center">
                        {value === 1 ? 'Strongly Disagree' :
                         value === 2 ? 'Disagree' :
                         value === 3 ? 'Neutral' :
                         value === 4 ? 'Agree' :
                         'Strongly Agree'}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          {currentQuestion === questions.length - 1 ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Complete Assessment'}</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={goToNext}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}
// AssessmentInterface.tsx
// 'use client';
// import { motion } from 'framer-motion';
// import { useForm } from 'react-hook-form';
// import { Button } from '@/components/ui/button';
// import { QuestionType } from '@prisma/client';
// import { useState } from 'react';
// import { submitAssessmentResponse } from '@/lib/actions/response';

// export default function AssessmentInterface({ assessment }: { assessment: any }) {
//   const { register, handleSubmit, formState } = useForm();
//   const [currentQuestion, setCurrentQuestion] = useState(0);

//   const onSubmit = async (data: any) => {
//     await submitAssessmentResponse({
//       assessmentId: assessment.id,
//       responses: Object.entries(data).map(([questionId, value]) => ({
//         questionId,
//         value
//       }))
//     });
//     console.log('Done')
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="max-w-3xl mx-auto space-y-8"
//     >
//       <div className="space-y-2">
//         <h1 className="text-3xl font-bold">{assessment.title}</h1>
//         <p className="text-muted-foreground">{assessment.description}</p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//         {assessment.questions.map((question, index) => (
//           <motion.div
//             key={question.id}
//             initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             className="space-y-4"
//           >
//             <div className="space-y-2">
//               <h3 className="text-lg font-medium">
//                 Question {index + 1} of {assessment.questions.length}
//               </h3>
//               <p className="text-base">{question.text}</p>
//             </div>

//             {question.type === QuestionType.MULTIPLE_CHOICE && (
//               <div className="space-y-2">
//                 {question.options?.map((option: any) => (
//                   <label key={option.id} className="flex items-center space-x-3">
//                     <input
//                       type="radio"
//                       value={option.value}
//                       {...register(question.id, { required: true })}
//                       className="h-4 w-4"
//                     />
//                     <span>{option.text}</span>
//                   </label>
//                 ))}
//               </div>
//             )}

//             {question.type === QuestionType.LIKERT_SCALE && (
//               <div className="grid grid-cols-5 gap-4">
//                 {[1, 2, 3, 4, 5].map((value) => (
//                   <label key={value} className="flex flex-col items-center">
//                     <input
//                       type="radio"
//                       value={value}
//                       {...register(question.id, { required: true })}
//                       className="h-4 w-4"
//                     />
//                     <span className="text-sm">{value}</span>
//                   </label>
//                 ))}
//               </div>
//             )}

//             {question.type === QuestionType.OPEN_ENDED && (
//               <textarea
//                 {...register(question.id, { required: true })}
//                 className="w-full h-32 p-3 border rounded-lg"
//               />
//             )}
//           </motion.div>
//         ))}

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="flex justify-end"
//         >
//           <Button
//             type="submit"
//             disabled={formState.isSubmitting}
//             className="px-8 py-4 text-lg"
//           >
//             {formState.isSubmitting ? 'Submitting...' : 'Complete Assessment'}
//           </Button>
//         </motion.div>
//       </form>
//     </motion.div>
//   );
// }
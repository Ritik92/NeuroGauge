'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { submitAssessmentResponse } from '@/lib/actions/response';
import { generateReport } from '@/lib/actions/generate-report-gemini';

// Types
interface Option {
  id: string;
  text: string;
  value: string;
}

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'LIKERT_SCALE' | 'OPEN_ENDED';
  options: Option[];
  orderIndex: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  gradeLevel: number[];
  type: 'PERSONALITY' | 'APTITUDE' | 'INTEREST' | 'LEARNING_STYLE';
  questions: Question[];
}

interface FormValues {
  [key: string]: string | number;
}

interface Response {
  questionId: string;
  value: string | number;
}

export default function AssessmentInterface({ assessment }: { assessment: any }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate progress
  const progress = (currentQuestion / assessment.questions.length) * 100;
  const allValues = watch();
  const questionsAnswered = Object.keys(allValues).length;
  const totalProgress = (questionsAnswered / assessment.questions.length) * 100;

  const handleNext = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Submitting your assessment...');

    try {
      // Format responses
      const responses: Response[] = Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value
      }));

      const val={
        assessmentId: assessment.id,
        responses
      }
      const result=await submitAssessmentResponse(val)

      const reportData = await generateReport(assessment, responses);

      // Save the report
      await axios.post('/api/students/report', {
        assessmentId: assessment.id,
        reportData: reportData
      });

      toast.success('Assessment completed successfully!');
      window.location.href='/dashboard/student/reports';
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit assessment');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <label 
                key={option.id} 
                className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...register(question.id, { 
                    required: 'Please select an option' 
                  })}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'LIKERT_SCALE':
        return (
          <div className="grid grid-cols-5 gap-4 pt-4">
            {[1, 2, 3, 4, 5].map((value) => (
              <label 
                key={value} 
                className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  value={value}
                  {...register(question.id, { 
                    required: 'Please select a rating' 
                  })}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-xs text-center mt-2">
                  {value === 1 ? 'Strongly Disagree' :
                   value === 2 ? 'Disagree' :
                   value === 3 ? 'Neutral' :
                   value === 4 ? 'Agree' :
                   'Strongly Agree'}
                </span>
              </label>
            ))}
          </div>
        );

      case 'OPEN_ENDED':
        return (
          <textarea
            {...register(question.id, { 
              required: 'Please provide an answer',
              minLength: { value: 10, message: 'Answer must be at least 10 characters' }
            })}
            className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Type your answer here..."
          />
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-center">{assessment.title}</h1>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          {assessment.description}
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(totalProgress)}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            key={currentQuestion}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center justify-between">
                <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
                <span className="text-sm text-muted-foreground">
                  {assessment.questions[currentQuestion].type.replace('_', ' ')}
                </span>
              </h3>
              <p className="text-lg font-medium">{assessment.questions[currentQuestion].text}</p>
            </div>

            {renderQuestion(assessment.questions[currentQuestion])}
            
            {errors[assessment.questions[currentQuestion].id] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[assessment.questions[currentQuestion].id]?.message}
              </p>
            )}
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion < assessment.questions.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!allValues[assessment.questions[currentQuestion].id]}
              >
                Next Question
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || questionsAnswered !== assessment.questions.length}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Complete'
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
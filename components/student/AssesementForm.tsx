// AssessmentInterface.tsx
'use client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { QuestionType } from '@prisma/client';
import { useState } from 'react';
import { submitAssessmentResponse } from '@/lib/actions/response';

export default function AssessmentInterface({ assessment }: { assessment: any }) {
  const { register, handleSubmit, formState } = useForm();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const onSubmit = async (data: any) => {
    await submitAssessmentResponse({
      assessmentId: assessment.id,
      responses: Object.entries(data).map(([questionId, value]) => ({
        questionId,
        value
      }))
    });
    console.log('Done')
  };

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

            {question.type === QuestionType.MULTIPLE_CHOICE && (
              <div className="space-y-2">
                {question.options?.map((option: any) => (
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

            {question.type === QuestionType.LIKERT_SCALE && (
              <div className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex flex-col items-center">
                    <input
                      type="radio"
                      value={value}
                      {...register(question.id, { required: true })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{value}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === QuestionType.OPEN_ENDED && (
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
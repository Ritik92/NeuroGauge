'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitAssessmentAndGenerateReport } from '@/lib/actions/generate-report';

interface FormValues { [key: string]: string | number }
interface Response { questionId: string; value: string | number }

const Ico = ({ children, size = 16 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const likertLabels = ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'];

export default function AssessmentInterface({ assessment }: { assessment: any }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const total = assessment.questions.length;
  const allValues = watch();
  const answered = Object.keys(allValues).filter((k) => allValues[k] !== undefined && allValues[k] !== '').length;
  const progress = Math.round((answered / total) * 100);
  const q = assessment.questions[currentQuestion];
  const currentValue = allValues[q.id];

  const handleNext = () => { if (currentQuestion < total - 1) setCurrentQuestion((p) => p + 1); };
  const handlePrevious = () => { if (currentQuestion > 0) setCurrentQuestion((p) => p - 1); };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Submitting your assessment…');
    try {
      const responses: Response[] = Object.entries(data).map(([questionId, value]) => ({ questionId, value }));
      await submitAssessmentAndGenerateReport({ assessmentId: assessment.id, responses });
      toast.success('Assessment completed successfully!');
      window.location.href = '/dashboard/student/reports';
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error?.message || 'Failed to submit assessment');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  // register once per question so RHF tracks the value; we drive selection with setValue
  const reg = (required: string) => register(q.id, { required });

  const renderQuestion = () => {
    switch (q.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
            {q.options?.map((option: any) => {
              const on = String(currentValue) === String(option.value);
              return (
                <label key={option.id} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '14px 16px', borderRadius: 11, cursor: 'pointer', fontSize: 14.5, transition: 'all .12s ease', border: on ? '1.5px solid var(--pri)' : '1px solid var(--border-c)', background: on ? 'var(--tint)' : 'var(--surface)', color: 'var(--ink)', fontWeight: on ? 600 : 500 }}>
                  <input type="radio" value={option.value} {...reg('Please select an option')} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                  <span style={{ width: 18, height: 18, flex: '0 0 auto', borderRadius: '50%', border: on ? '5px solid var(--pri)' : '2px solid var(--border-c)', boxSizing: 'border-box' }} />
                  {option.text}
                </label>
              );
            })}
          </div>
        );
      case 'LIKERT_SCALE':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 22 }}>
            {[1, 2, 3, 4, 5].map((value, i) => {
              const on = String(currentValue) === String(value);
              return (
                <label key={value} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '14px 6px', borderRadius: 11, cursor: 'pointer', border: on ? '1.5px solid var(--pri)' : '1px solid var(--border-c)', background: on ? 'var(--tint)' : 'var(--surface)', color: on ? 'var(--pri)' : 'var(--muted)' }}>
                  <input type="radio" value={value} {...reg('Please select a rating')} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
                  <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, background: on ? 'var(--pri)' : 'var(--canvas)', color: on ? '#fff' : 'var(--muted)' }}>{value}</span>
                  <span style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.3 }}>{likertLabels[i]}</span>
                </label>
              );
            })}
          </div>
        );
      case 'OPEN_ENDED':
        return (
          <textarea
            {...register(q.id, { required: 'Please provide an answer', minLength: { value: 10, message: 'Answer must be at least 10 characters' } })}
            className="ng-input"
            placeholder="Type your answer here…"
            style={{ width: '100%', boxSizing: 'border-box', height: 128, marginTop: 22, padding: 14, borderRadius: 11, border: '1px solid var(--border-c)', background: 'var(--surface)', fontSize: 14.5, color: 'var(--ink)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
          />
        );
      default:
        return null;
    }
  };

  const isLast = currentQuestion === total - 1;
  const canNext = currentValue !== undefined && currentValue !== '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 620 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>{assessment.title}</h1>
          {assessment.description && <p style={{ fontSize: 14, color: 'var(--muted)', margin: '6px 0 0' }}>{assessment.description}</p>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
          <span>Question {currentQuestion + 1} of {total}</span>
          <span>{progress}% complete</span>
        </div>
        <div style={{ height: 7, borderRadius: 999, background: 'var(--border-c)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 999, background: 'var(--pri)', width: `${progress}%`, transition: 'width .3s ease' }} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: 16, padding: 30, marginTop: 26 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--pri)' }}>{q.type.replace(/_/g, ' ')}</span>
            <h2 style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.35, color: 'var(--ink)', margin: '12px 0 0' }}>{q.text}</h2>
            {renderQuestion()}
            {errors[q.id] && <p style={{ color: '#C0453B', fontSize: 13, marginTop: 12 }}>{(errors[q.id] as any)?.message}</p>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button type="button" onClick={handlePrevious} disabled={currentQuestion === 0} style={{ height: 44, padding: '0 20px', borderRadius: 10, border: '1px solid var(--border-c)', background: 'var(--surface)', color: currentQuestion === 0 ? 'var(--muted)' : 'var(--ink)', fontSize: 14.5, fontWeight: 600, cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: currentQuestion === 0 ? 0.5 : 1 }}>Previous</button>
            {!isLast ? (
              <button type="button" onClick={handleNext} disabled={!canNext} style={{ height: 44, padding: '0 22px', borderRadius: 10, border: 'none', background: canNext ? 'var(--pri)' : 'var(--border-c)', color: canNext ? '#fff' : 'var(--muted)', fontSize: 14.5, fontWeight: 600, cursor: canNext ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>Next question</button>
            ) : (
              <button type="submit" disabled={isLoading || answered !== total} style={{ height: 44, padding: '0 22px', borderRadius: 10, border: 'none', background: !isLoading && answered === total ? 'var(--pri)' : 'var(--border-c)', color: !isLoading && answered === total ? '#fff' : 'var(--muted)', fontSize: 14.5, fontWeight: 600, cursor: !isLoading && answered === total ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {isLoading ? 'Submitting…' : 'Complete assessment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

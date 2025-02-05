import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface QuestionResponse {
  questionId: string;
  value: any;
}

interface ProcessedResponse {
  question: string;
  type: string;
  answer: string | number;
}

interface CareerRecommendation {
  title: string;
  reason: string;
  field: 'STEM' | 'Arts' | 'Business' | 'Technology' | 'Education' | 'Engineering';
}

export interface ProcessedData {
  studentInfo: {
    name: string;
    grade: string;
    age: number;
    personalityType: string;
    assessmentDate?: string;
    overallPercentile?: number;
  };
  cognitiveProfile: {
    analyticalThinking: number;
    creativeReasoning: number;
    problemSolving: number;
    memoryRecall: number;
    spatialVisualization: number;
    verbalComprehension: number;
  };
  learningStyle: {
    primary: string;
    secondary: string;
    characteristics: string[];
  };
  strengths: {
    title: string;
    description: string;
    score: number;
  }[];
  developmentAreas: string[];
  recommendations: {
    title: string;
    description: string;
    icon: 'Book' | 'Brain' | 'Users' | 'Target';
  }[];
  bestCareer: CareerRecommendation;
  suggestedCareers: CareerRecommendation[];
}

export async function generateReport(assessmentData: any, responses: QuestionResponse[]): Promise<ProcessedData> {
  try {
    const processedResponses: ProcessedResponse[] = responses.map(response => {
      const question = assessmentData.questions.find((q: any) => q.id === response.questionId);
      let formattedAnswer = response.value;

      if (question.type === 'MULTIPLE_CHOICE') {
        const option = question.options.find((opt: any) => opt.value.toString() === response.value.toString());
        formattedAnswer = option ? option.text : response.value;
      }

      return {
        question: question.text,
        type: question.type,
        answer: formattedAnswer
      };
    });

    const prompt = 
`Act as expert career counselor and educational psychologist with 20+ years experience. Analyze this 
assessment data and generate comprehensive report in STRICT JSON format:

Required JSON Structure:
{
  "studentInfo": {
    "name": "Realistic full name",
    "grade": "Formatted grade level",
    "age": Typical age for grade,
    "personalityType": "MBTI type with label"
  },
  "cognitiveProfile": {
    "analyticalThinking": 0-100,
    "creativeReasoning": 0-100,
    "problemSolving": 0-100,
    "memoryRecall": 0-100,
    "spatialVisualization": 0-100,
    "verbalComprehension": 0-100
  },
  "learningStyle": {
    "primary": "Gardner's intelligence type",
    "secondary": "Gardner's intelligence type",
    "characteristics": [
      "4-5 learning traits matching cognitive profile",
      "Focus on information processing styles",
      "Include knowledge retention methods",
      "Highlight knowledge application approaches"
    ]
  },
  "strengths": [
    {
      "title": "Specific cognitive strength",
      "description": "Practical manifestation of strength",
      "score": Matching cognitive dimension score
    }
  ],
  "developmentAreas": [
    "2-3 concise improvement areas",
    "Focus on skill gaps, not personality",
    "Prioritize academic-impact items"
  ],
  "recommendations": [
    {
      "title": "Concrete action item",
      "description": "Implementation specifics",
      "icon": "Exactly one of: Book, Brain, Users, Target"
    }
  ],
  "bestCareer": {
    "title": "Specific career name",
    "reason": "3-sentence explanation linking to cognitive profile",
    "field": "Exactly one of: STEM, Arts, Business, Technology, Education, Engineering"
  },
  "suggestedCareers": [
    {
      "title": "Alternative career name",
      "reason": "2-sentence rationale based on strengths",
      "field": "Same field options as bestCareer"
    },
    {
      "title": "Another career name",
      "reason": "2-sentence rationale",
      "field": "Different field from bestCareer"
    }
  ]
}

Analysis Requirements:
1. Generate realistic demographics matching grade level
2. Calculate cognitive scores from question types/responses
3. Determine learning styles from response patterns
4. Create MBTI personality from response tendencies
5. Recommend 3-4 specific interventions with matching icons
6. Career recommendations must:
   - Align with cognitive strengths and learning style
   - Include grade-appropriate options
   - Feature emerging fields where relevant
   - Provide specific rationale linking assessment to career
   - Balance realistic and aspirational options

Validation Rules:
- All career fields must match exactly specified categories
- Career reasons must reference specific cognitive scores
- MBTI type must include 4-letter code and label
- Icons must match recommendation types
- No markdown in JSON output

Questions and Responses:
${processedResponses.map((r, i) => 
  `[Q${i + 1}] ${r.question}\nType: ${r.type}\nResponse: ${r.answer}`
).join("\n\n")}

Respond ONLY with valid JSON using double quotes. Escape special characters properly.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json\n?|\n?```/g, '').trim();

    try {
      const reportData: ProcessedData = JSON.parse(text);
      
      return {
        ...reportData,
        studentInfo: {
          ...reportData.studentInfo,
          assessmentDate: new Date().toISOString(),
          overallPercentile: calculateOverallPercentile(reportData.cognitiveProfile)
        }
      };
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('Raw Response:', text);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Report Generation Error:', error);
    throw new Error('Assessment report generation failed');
  }
}

function calculateOverallPercentile(cognitiveProfile: any): number {
  const scores = Object.values(cognitiveProfile) as number[];
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}
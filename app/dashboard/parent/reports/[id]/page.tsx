'use client'
import ReportInterface from "@/components/report-interface";
import { getParentReport } from "@/lib/actions/report";

import { notFound } from "next/navigation";

import { getStudentDetail } from "@/lib/actions/getstudentdetail";
import { getStudentReport } from "@/lib/actions/report";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface PageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ParentReportPage({ params }: any) {
  const { data: session } = useSession();
    const userId = session?.user?.id;
    const [student, setStudent] = useState<any>(null);
    useEffect(() => {
      const fetchData = async () => {
          if (userId) {
              const studentData = await getStudentDetail(userId);
             
              setStudent(studentData.student);
              
          }
      };
      
      fetchData();
  }, [userId, params.id]);
  try {
    const report = await getParentReport(params.id);
    if (!report) return notFound();
//removed old reportInterface
const data={
  "studentInfo": {
      "name": "Alice Johnson",
      "grade": "10th Grade",
      "age": 15,
      "personalityType": "INTJ \"Architect\"",
      "assessmentDate": "2025-02-05T21:14:23.041Z",
      "overallPercentile": 77
  },
  "cognitiveProfile": {
      "analyticalThinking": 85,
      "creativeReasoning": 70,
      "problemSolving": 90,
      "memoryRecall": 75,
      "spatialVisualization": 60,
      "verbalComprehension": 80
  },
  "learningStyle": {
      "primary": "Logical-Mathematical",
      "secondary": "Linguistic",
      "characteristics": [
          "Prefers structured learning environments",
          "Processes information logically and sequentially",
          "Strong in deductive reasoning and problem-solving",
          "Benefits from visual aids and real-world applications"
      ]
  },
  "strengths": [
      {
          "title": "Analytical Thinking",
          "description": "Excels at identifying patterns, analyzing data, and drawing logical conclusions.",
          "score": 85
      },
      {
          "title": "Problem-Solving",
          "description": "Demonstrates exceptional ability to devise effective solutions to complex challenges.",
          "score": 90
      }
  ],
  "developmentAreas": [
      "Improve spatial reasoning skills through hands-on activities.",
      "Enhance creative expression through writing and visual arts.",
      "Develop strategies for managing time effectively."
  ],
  "recommendations": [
      {
          "title": "Engage in STEM enrichment programs.",
          "description": "Participate in robotics clubs, coding workshops, or science competitions to build practical skills and foster interest in STEM fields.",
          "icon": "Brain"
      },
      {
          "title": "Explore visual learning techniques.",
          "description": "Utilize mind mapping, graphic organizers, and other visual tools to improve understanding and retention of information.",
          "icon": "Book"
      },
      {
          "title": "Practice active recall techniques.",
          "description": "Employ spaced repetition, flashcards, and self-testing to strengthen memory recall and improve knowledge retention.",
          "icon": "Brain"
      }
  ],
  "bestCareer": {
      "title": "Data Scientist",
      "reason": "This career leverages Alice's high analytical thinking (85) and problem-solving (90) skills.  Her strong logical-mathematical learning style is perfectly suited to the analytical nature of data science. The field is also rapidly expanding, offering numerous opportunities.",
      "field": "STEM"
  },
  "suggestedCareers": [
      {
          "title": "Software Engineer",
          "reason": "Alice's strong analytical abilities and problem-solving skills translate well to software development.  Her logical-mathematical learning style allows for efficient code comprehension and creation.",
          "field": "Technology"
      },
      {
          "title": "Financial Analyst",
          "reason": "This role demands strong analytical thinking and problem-solving skills, which Alice possesses in abundance. The structured and logical nature of financial analysis aligns well with her learning preferences.",
          "field": "Business"
      }
  ]
}
    return (
      <div className="container py-12">
        <ReportInterface  demoData={data} student={student}/> 
      </div>
    );
  } catch (error) {
    // If there's an authorization error or other issues
    return (
      <div className="container py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You don't have permission to view this report.
          </p>
        </div>
      </div>
    );
  }
}
// const { PrismaClient, AssessmentType, AssessmentStatus, QuestionType } = require('@prisma/client');
// const { hash } = require('bcrypt');
// const { faker } = require('@faker-js/faker');

// const prisma = new PrismaClient();

// const CUSTOM_ASSESSMENTS = [
//   {
//     title: 'Young Explorer Cognitive & Career Discovery',
//     description: 'Assesses foundational cognitive patterns and early career inclinations',
//     gradeLevel: [1, 2, 3, 4],
//     type: AssessmentType.LEARNING_STYLE,
//     status: AssessmentStatus.PUBLISHED,
//     duration: 35,
//     questions: [
//       {
//         text: 'When solving puzzles, I prefer:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 1,
//         options: JSON.stringify([
//           { id: 'c1', text: 'Number patterns', value: 'logical_mathematical' },
//           { id: 'c2', text: 'Color matching', value: 'artistic_visual' },
//           { id: 'c3', text: 'Building shapes', value: 'spatial_mechanical' },
//           { id: 'c4', text: 'Story puzzles', value: 'verbal_linguistic' }
//         ])
//       },
//       {
//         text: 'My favorite way to learn is:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 2,
//         options: JSON.stringify([
//           { id: 'l1', text: 'Watching demonstrations', value: 'visual_learning' },
//           { id: 'l2', text: 'Listening to instructions', value: 'auditory_learning' },
//           { id: 'l3', text: 'Hands-on practice', value: 'kinesthetic_learning' },
//           { id: 'l4', text: 'Working with friends', value: 'social_learning' }
//         ])
//       },
//       {
//         text: 'What do you enjoy doing during free time?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 3,
//         options: JSON.stringify([
//           { id: 'h1', text: 'Drawing and coloring', value: 'artistic' },
//           { id: 'h2', text: 'Playing with building blocks', value: 'engineering' },
//           { id: 'h3', text: 'Reading stories', value: 'literary' },
//           { id: 'h4', text: 'Counting and sorting things', value: 'mathematical' }
//         ])
//       },
//       {
//         text: 'How do you approach new challenges?',
//         type: QuestionType.LIKERT_SCALE,
//         orderIndex: 4,
//         options: JSON.stringify(['Very Cautious', '', '', '', 'Very Bold'])
//       },
//       {
//         text: 'When working with others, I prefer to:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 5,
//         options: JSON.stringify([
//           { id: 's1', text: 'Lead the group', value: 'leadership' },
//           { id: 's2', text: 'Help others', value: 'supportive' },
//           { id: 's3', text: 'Share ideas', value: 'collaborative' },
//           { id: 's4', text: 'Work independently', value: 'independent' }
//         ])
//       }
//     ]
//   },
//   {
//     title: 'Emerging Cognitive Patterns & Career Pathways',
//     description: 'Evaluates developing cognitive strengths and career alignment potential',
//     gradeLevel: [5, 6, 7, 8],
//     type: AssessmentType.APTITUDE,
//     status: AssessmentStatus.PUBLISHED,
//     duration: 45,
//     questions: [
//       {
//         text: 'When working on complex tasks, I:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 1,
//         options: JSON.stringify([
//           { id: 't1', text: 'Follow systematic approaches', value: 'analytical_methodical' },
//           { id: 't2', text: 'Experiment with new methods', value: 'innovative_creative' },
//           { id: 't3', text: 'Collaborate with peers', value: 'social_collaborative' },
//           { id: 't4', text: 'Use visual organization', value: 'visual_spatial' }
//         ])
//       },
//       {
//         text: 'Which subjects interest you most?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 2,
//         options: JSON.stringify([
//           { id: 'i1', text: 'Science and Mathematics', value: 'stem_oriented' },
//           { id: 'i2', text: 'Art and Music', value: 'creative_arts' },
//           { id: 'i3', text: 'Language and Literature', value: 'humanities' },
//           { id: 'i4', text: 'Physical Education and Sports', value: 'physical_kinesthetic' }
//         ])
//       },
//       {
//         text: 'How do you prefer to solve problems?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 3,
//         options: JSON.stringify([
//           { id: 'p1', text: 'Research and analyze', value: 'analytical' },
//           { id: 'p2', text: 'Brainstorm creative solutions', value: 'creative' },
//           { id: 'p3', text: 'Discuss with others', value: 'collaborative' },
//           { id: 'p4', text: 'Trial and error', value: 'experimental' }
//         ])
//       },
//       {
//         text: 'Rate your problem-solving style:',
//         type: QuestionType.LIKERT_SCALE,
//         orderIndex: 4,
//         options: JSON.stringify(['Highly Analytical', '', '', '', 'Highly Creative'])
//       },
//       {
//         text: 'What type of projects excite you most?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 5,
//         options: JSON.stringify([
//           { id: 'e1', text: 'Building and designing', value: 'engineering_design' },
//           { id: 'e2', text: 'Helping and teaching others', value: 'social_service' },
//           { id: 'e3', text: 'Creating art or music', value: 'artistic_expression' },
//           { id: 'e4', text: 'Organizing and planning', value: 'management_planning' }
//         ])
//       }
//     ]
//   },
//   {
//     title: 'Advanced Cognitive Profile & Career Aptitude Assessment',
//     description: 'Comprehensive analysis of cognitive strengths and career alignment',
//     gradeLevel: [9, 10, 11, 12],
//     type: AssessmentType.PERSONALITY,
//     status: AssessmentStatus.PUBLISHED,
//     duration: 60,
//     questions: [
//       {
//         text: 'When faced with ambiguous problems, I typically:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 1,
//         options: JSON.stringify([
//           { id: 'p1', text: 'Break into components', value: 'analytical_systematic' },
//           { id: 'p2', text: 'Seek patterns/connections', value: 'synthesis_pattern' },
//           { id: 'p3', text: 'Prototype solutions', value: 'practical_experimental' },
//           { id: 'p4', text: 'Research precedents', value: 'research_methodical' }
//         ])
//       },
//       {
//         text: 'What career sectors interest you most?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 2,
//         options: JSON.stringify([
//           { id: 'c1', text: 'Technology and Innovation', value: 'tech_innovation' },
//           { id: 'c2', text: 'Healthcare and Social Services', value: 'healthcare_social' },
//           { id: 'c3', text: 'Business and Finance', value: 'business_finance' },
//           { id: 'c4', text: 'Arts and Communication', value: 'arts_communication' }
//         ])
//       },
//       {
//         text: 'In group projects, I naturally tend to:',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 3,
//         options: JSON.stringify([
//           { id: 'g1', text: 'Take charge and delegate', value: 'leadership_management' },
//           { id: 'g2', text: 'Generate creative ideas', value: 'creative_ideation' },
//           { id: 'g3', text: 'Handle technical details', value: 'technical_execution' },
//           { id: 'g4', text: 'Facilitate communication', value: 'communication_facilitation' }
//         ])
//       },
//       {
//         text: 'Rate your leadership approach:',
//         type: QuestionType.LIKERT_SCALE,
//         orderIndex: 4,
//         options: JSON.stringify(['Directive', '', '', '', 'Collaborative'])
//       },
//       {
//         text: 'How do you prefer to learn new skills?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 5,
//         options: JSON.stringify([
//           { id: 'l1', text: 'Structured courses and certification', value: 'formal_structured' },
//           { id: 'l2', text: 'Self-directed research and practice', value: 'self_directed' },
//           { id: 'l3', text: 'Mentorship and guidance', value: 'mentored_guided' },
//           { id: 'l4', text: 'Hands-on experience and projects', value: 'experiential' }
//         ])
//       },
//       {
//         text: 'What aspects of a career are most important to you?',
//         type: QuestionType.MULTIPLE_CHOICE,
//         orderIndex: 6,
//         options: JSON.stringify([
//           { id: 'v1', text: 'Innovation and creativity', value: 'innovation_creativity' },
//           { id: 'v2', text: 'Helping others and social impact', value: 'social_impact' },
//           { id: 'v3', text: 'Financial security and growth', value: 'financial_security' },
//           { id: 'v4', text: 'Work-life balance and flexibility', value: 'work_life_balance' }
//         ])
//       }
//     ]
//   }
// ];

// async function clearAssessmentData() {
//   console.log('Clearing existing assessment data...');
//   await prisma.$transaction([
//     prisma.response.deleteMany(),
//     prisma.studentAssessment.deleteMany(),
//     prisma.question.deleteMany(),
//     prisma.assessment.deleteMany(),
//   ]);
// }

// async function createCustomAssessments() {
//   console.log('Creating new assessments...');
//   for (const assessmentData of CUSTOM_ASSESSMENTS) {
//     await prisma.assessment.create({
//       data: {
//         title: assessmentData.title,
//         description: assessmentData.description,
//         type: assessmentData.type,
//         status: assessmentData.status,
//         gradeLevel: assessmentData.gradeLevel,
//         duration: assessmentData.duration,
//         questions: {
//           create: assessmentData.questions.map(q => ({
//             text: q.text,
//             type: q.type,
//             options: q.options,
//             orderIndex: q.orderIndex
//           }))
//         }
//       }
//     });
//   }
// }

// async function main() {
//   try {
//     await clearAssessmentData();
//     await createCustomAssessments();
//     console.log('Seed completed successfully!');
//   } catch (error) {
//     console.error('Seed failed:', error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();
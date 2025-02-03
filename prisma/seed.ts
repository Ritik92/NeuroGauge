

const { PrismaClient, UserRole,CompletionStatus, AssessmentType, AssessmentStatus, QuestionType, SchoolReportType } = require('@prisma/client');
const { hash } = require('bcrypt');
const { faker } = require('@faker-js/faker');

// Initialize Prisma Client with custom configs
const prisma = new PrismaClient({
  log: ['warn', 'error'],
});

// Constants for data generation
const SCHOOLS_COUNT = 3;
const STUDENTS_PER_SCHOOL = 10;
const PARENTS_COUNT = 10;
const ASSESSMENTS_COUNT = 5;
const QUESTIONS_PER_ASSESSMENT = 5;
const BATCH_SIZE = 50;

// Reusable options
const likertOptions = [
  { id: '1', text: 'Strongly Disagree', value: 1 },
  { id: '2', text: 'Disagree', value: 2 },
  { id: '3', text: 'Neutral', value: 3 },
  { id: '4', text: 'Agree', value: 4 },
  { id: '5', text: 'Strongly Agree', value: 5 }
];

const assessmentTypes = [
  { type: AssessmentType.LEARNING_STYLE, prefix: 'Learning Style' },
  { type: AssessmentType.APTITUDE, prefix: 'Career Aptitude' },
  { type: AssessmentType.PERSONALITY, prefix: 'Personality' },
  { type: AssessmentType.INTEREST, prefix: 'Interest' }
];

// Helper functions
const generateHash = async (str) => hash(str, 10);
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const generateGradeLevels = () => Array.from(
  { length: Math.floor(Math.random() * 4) + 1 },
  () => Math.floor(Math.random() * 12) + 1
);

async function clearDatabase() {
  console.log('Clearing existing data...');
  try {
    // Delete in correct order to handle foreign key constraints
    await prisma.$transaction([
      prisma.schoolReport.deleteMany(),
      prisma.report.deleteMany(),
      prisma.studentAssessment.deleteMany(),
      prisma.response.deleteMany(),
      prisma.question.deleteMany(),
      prisma.assessment.deleteMany(),
      prisma.payment.deleteMany(), // Add this before deleting schools
      prisma.student.deleteMany(),
      prisma.parent.deleteMany(),
      prisma.school.deleteMany(),
      prisma.user.deleteMany(),
    ]);
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}
async function createSystemAdmin() {
  console.log('Creating system admin...');
  return prisma.user.create({
    data: {
      email: 'system@admin.com',
      password: await generateHash('121245'),
      role: UserRole.SYSTEM_ADMIN
    }
  });
}

async function createSchoolBatch(startIndex, count) {
  const schools = [];
  for (let i = 0; i < count; i++) {
    try {
      const index = startIndex + i;
      const school = await prisma.user.create({
        data: {
          email: `admin${index + 1}@school${index + 1}.edu`,
          password: await generateHash('121245'),
          role: UserRole.SCHOOL_ADMIN,
          school: {
            create: {
              name: faker.company.name() + ' School',
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              state: faker.location.state(),
              country: 'USA',
              phone: faker.phone.number(),
              adminFirstName: faker.person.firstName(),
              adminLastName: faker.person.lastName()
            }
          }
        },
        include: { school: true }
      });
      schools.push(school);
    } catch (error) {
      console.error(`Error creating school at index ${startIndex + i}:`, error);
      throw error;
    }
  }
  return schools;
}

async function createParentBatch(startIndex, count) {
  const parents = [];
  for (let i = 0; i < count; i++) {
    try {
      const index = startIndex + i;
      const parent = await prisma.user.create({
        data: {
          email: `parent${index + 1}@example.com`,
          password: await generateHash('121245'),
          role: UserRole.PARENT,
          parent: {
            create: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              phone: faker.phone.number()
            }
          }
        },
        include: { parent: true }
      });
      parents.push(parent);
    } catch (error) {
      console.error(`Error creating parent at index ${startIndex + i}:`, error);
      throw error;
    }
  }
  return parents;
}

async function createStudentBatch(school, startIndex, count, allParents) {
  const students = [];
  for (let i = 0; i < count; i++) {
    try {
      const index = startIndex + i;
      const studentEmail = `student${index + 1}@${school.school.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.edu`;
      const student = await prisma.user.create({
        data: {
          email: studentEmail,
          password: await generateHash('121245'),
          role: UserRole.STUDENT,
          student: {
            create: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              dateOfBirth: faker.date.past({ years: 18 }),
              grade: Math.floor(Math.random() * 4) + 9,
              schoolId: school.school.id,
              parents: {
                connect: randomItems(allParents.map(p => ({ id: p.parent.id })), Math.min(2, allParents.length))
              }
            }
          }
        },
        include: { student: true }
      });
      students.push(student);
    } catch (error) {
      console.error(`Error creating student at index ${startIndex + i}:`, error);
      throw error;
    }
  }
  return students;
}

async function createAssessments() {
  const assessments = [];
  for (let i = 0; i < ASSESSMENTS_COUNT; i++) {
    try {
      const assessmentType = randomItem(assessmentTypes);
      const assessment = await prisma.assessment.create({
        data: {
          title: `${assessmentType.prefix} Assessment ${i + 1}`,
          description: faker.lorem.sentence(),
          type: assessmentType.type,
          status: AssessmentStatus.PUBLISHED,
          gradeLevel: generateGradeLevels(),
          duration: Math.floor(Math.random() * 60) + 30,
          questions: {
            create: Array.from({ length: QUESTIONS_PER_ASSESSMENT }, (_, qIndex) => ({
              text: faker.lorem.sentence() + '?',
              type: QuestionType.LIKERT_SCALE,
              options: likertOptions,
              orderIndex: qIndex + 1
            }))
          }
        },
        include: { questions: true }
      });
      assessments.push(assessment);
    } catch (error) {
      console.error(`Error creating assessment ${i + 1}:`, error);
      throw error;
    }
  }
  return assessments;
}
async function createStudentAssessments(students, assessments) {
  try {
    for (const student of students) {
      for (const assessment of assessments) {
        await prisma.studentAssessment.create({
          data: {
            studentId: student.student.id,
            assessmentId: assessment.id,
            status: CompletionStatus.PENDING,
            startedAt: null,
            completedAt: null
          }
        });
      }
    }
  } catch (error) {
    console.error('Error creating StudentAssessments:', error);
    throw error;
  }
}
async function createResponseBatch(student, assessment) {
  try {
    const responses = assessment.questions.map(question => ({
      value: { selectedOption: randomItem(likertOptions).id },
      studentId: student.student.id,
      assessmentId: assessment.id,
      questionId: question.id
    }));

    await prisma.response.createMany({ data: responses });
  } catch (error) {
    console.error(`Error creating responses for student ${student.student.id}:`, error);
    throw error;
  }
}

async function createReports(students, schools) {
  try {
    // Create student reports
    for (const student of students) {
      await prisma.report.create({
        data: {
          studentId: student.student.id,
          data: {
            strengths: randomItems(['Analytical', 'Creative', 'Organized', 'Collaborative', 'Persistent'], 2),
            recommendations: randomItems(['Advanced courses', 'Tutoring', 'Extracurricular activities', 'Mentorship'], 2),
            personalityType: randomItem(['Type A', 'Type B', 'Type C']),
            averageScore: Math.floor(Math.random() * 40 + 60)
          }
        }
      });
    }

    // Create school reports
    for (const school of schools) {
      await prisma.schoolReport.createMany({
        data: [{
          schoolId: school.school.id,
          type: SchoolReportType.GRADE_WISE,
          data: {
            totalStudents: STUDENTS_PER_SCHOOL,
            averageScores: {
              math: Math.floor(Math.random() * 40 + 60),
              science: Math.floor(Math.random() * 40 + 60),
              arts: Math.floor(Math.random() * 40 + 60)
            }
          }
        }, {
          schoolId: school.school.id,
          type: SchoolReportType.YEARLY,
          data: {
            academicYear: new Date().getFullYear(),
            graduationRate: Math.floor(Math.random() * 20 + 80),
            collegeAcceptance: Math.floor(Math.random() * 20 + 75)
          }
        }]
      });
    }
  } catch (error) {
    console.error('Error creating reports:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting seed process...');
    
    await clearDatabase();
    await createSystemAdmin();

    // Create schools in batches
    console.log('Creating schools...');
    const schools = [];
    for (let i = 0; i < SCHOOLS_COUNT; i += BATCH_SIZE) {
      const batchSize = Math.min(BATCH_SIZE, SCHOOLS_COUNT - i);
      const schoolBatch = await createSchoolBatch(i, batchSize);
      schools.push(...schoolBatch);
      console.log(`Created schools ${i + 1} to ${i + schoolBatch.length}`);
    }

    // Create parents in batches
    console.log('Creating parents...');
    const parents = [];
    for (let i = 0; i < PARENTS_COUNT; i += BATCH_SIZE) {
      const batchSize = Math.min(BATCH_SIZE, PARENTS_COUNT - i);
      const parentBatch = await createParentBatch(i, batchSize);
      parents.push(...parentBatch);
      console.log(`Created parents ${i + 1} to ${i + parentBatch.length}`);
    }

    // Create students school by school
    console.log('Creating students...');
    const students = [];
    for (const school of schools) {
      const schoolStudents = [];
      for (let i = 0; i < STUDENTS_PER_SCHOOL; i += BATCH_SIZE) {
        const batchSize = Math.min(BATCH_SIZE, STUDENTS_PER_SCHOOL - i);
        const studentBatch = await createStudentBatch(school, i, batchSize, parents);
        schoolStudents.push(...studentBatch);
      }
      students.push(...schoolStudents);
      console.log(`Created ${schoolStudents.length} students for ${school.school.name}`);
    }

    // Create assessments
    console.log('Creating assessments and questions...');
    const assessments = await createAssessments();
    console.log(`Created ${assessments.length} assessments`);

    // Create responses for each student
    console.log('Creating responses...');
    for (const student of students) {
      for (const assessment of assessments) {
        await createResponseBatch(student, assessment);
      }
      console.log(`Created responses for student ${student.student.id}`);
    }
// In the main() function, after creating responses
// Create StudentAssessment entries
await createStudentAssessments(students, assessments);
    // Create reports
    console.log('Creating reports...');
    await createReports(students, schools);
    
    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
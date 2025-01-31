const { PrismaClient, UserRole, AssessmentType, AssessmentStatus, QuestionType, SchoolReportType } = require('@prisma/client');
const { hash } = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.schoolReport.deleteMany(),
    prisma.report.deleteMany(),
    prisma.response.deleteMany(),
    prisma.question.deleteMany(),
    prisma.assessment.deleteMany(),
    prisma.student.deleteMany(),
    prisma.parent.deleteMany(),
    prisma.school.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Create system admin
  const systemAdminPassword = await hash('system123', 10);
  await prisma.user.create({
    data: {
      email: 'system@admin.com',
      password: systemAdminPassword,
      role: 'SYSTEM_ADMIN'
    }
  });

  // Create first school with admin
  const springfieldAdminPw = await hash('springfield123', 10);
  const springfieldSchool = await prisma.user.create({
    data: {
      email: 'admin@springfield.edu',
      password: springfieldAdminPw,
      role: 'SCHOOL_ADMIN',
      school: {
        create: {
          name: 'Springfield High School',
          address: '123 Education Lane',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          phone: '(555) 123-4567',
          adminFirstName: 'John',
          adminLastName: 'Smith'
        }
      }
    },
    include: { school: true }
  });

  // Create second school
  const oakridgeAdminPw = await hash('oakridge123', 10);
  const oakridgeSchool = await prisma.user.create({
    data: {
      email: 'admin@oakridge.edu',
      password: oakridgeAdminPw,
      role: 'SCHOOL_ADMIN',
      school: {
        create: {
          name: 'Oakridge International',
          address: '456 Academy Road',
          city: 'Metropolis',
          state: 'NY',
          country: 'USA',
          phone: '(555) 234-5678',
          adminFirstName: 'Sarah',
          adminLastName: 'Wilson'
        }
      }
    },
    include: { school: true }
  });

  // Create parents
  const parents = await Promise.all([
    createParent('mary.johnson@example.com', 'Mary', 'Johnson', '(555) 987-6543'),
    createParent('david.smith@example.com', 'David', 'Smith', '(555) 876-5432'),
    createParent('lisa.wang@example.com', 'Lisa', 'Wang', '(555) 765-4321')
  ]);

  // Create students
  const students = await Promise.all([
    createStudent('james.johnson@example.com', 'James', 'Johnson', '2008-05-15', 9, springfieldSchool.school.id, [parents[0].id]),
    createStudent('emily.smith@example.com', 'Emily', 'Smith', '2009-02-20', 8, springfieldSchool.school.id, [parents[0].id, parents[1].id]),
    createStudent('daniel.wang@example.com', 'Daniel', 'Wang', '2010-11-10', 7, oakridgeSchool.school.id, [parents[2].id]),
    createStudent('sophia.chen@example.com', 'Sophia', 'Chen', '2007-08-30', 10, oakridgeSchool.school.id, [])
  ]);

  // Create assessments
  const assessments = await Promise.all([
    createAssessment('Learning Style Assessment', 'Determine learning preferences', AssessmentType.LEARNING_STYLE, [
      { text: 'I prefer visual materials over verbal explanations', type: QuestionType.LIKERT_SCALE, options: likertOptions },
      { text: 'Describe your ideal study environment', type: QuestionType.OPEN_ENDED }
    ]),
    createAssessment('Career Aptitude Test', 'Identify suitable career paths', AssessmentType.APTITUDE, [
      { text: 'I enjoy solving complex problems', type: QuestionType.LIKERT_SCALE, options: likertOptions },
      { text: 'Choose your preferred activities', type: QuestionType.MULTIPLE_CHOICE, options: careerOptions }
    ]),
    createAssessment('Personality Assessment', 'Big Five personality traits evaluation', AssessmentType.PERSONALITY, [
      { text: 'I see myself as someone who is talkative', type: QuestionType.LIKERT_SCALE, options: likertOptions },
      { text: 'I remain calm under pressure', type: QuestionType.LIKERT_SCALE, options: likertOptions }
    ])
  ]);

  // Create responses for each student
  for (const student of students) {
    for (const assessment of assessments) {
      const questions = await prisma.question.findMany({
        where: { assessmentId: assessment.id }
      });

      await prisma.response.createMany({
        data: questions.map((question, index) => ({
          value: createResponseValue(question.type, index),
          studentId: student.id,
          assessmentId: assessment.id,
          questionId: question.id
        }))
      });
    }
  }

  // Generate reports
  await generateStudentReports(students);
  await generateSchoolReports([springfieldSchool.school, oakridgeSchool.school]);

  console.log('Seed data created successfully!');
}

// Helper functions
async function createParent(email, firstName, lastName, phone) {
  const password = await hash('parent123', 10);
  const user = await prisma.user.create({
    data: {
      email,
      password,
      role: 'PARENT',
      parent: {
        create: { firstName, lastName, phone }
      }
    },
    include: { parent: true }
  });
  return user.parent;
}

async function createStudent(email, firstName, lastName, dob, grade, schoolId, parentIds) {
  const password = await hash('student123', 10);
  const user = await prisma.user.create({
    data: {
      email,
      password,
      role: 'STUDENT',
      student: {
        create: {
          firstName,
          lastName,
          dateOfBirth: new Date(dob),
          grade,
          schoolId,
          parents: { connect: parentIds.map(id => ({ id })) }
        }
      }
    },
    include: { student: true }
  });
  return user.student;
}

async function createAssessment(title, description, type, questions) {
  return prisma.assessment.create({
    data: {
      title,
      description,
      type,
      status: 'PUBLISHED',
      questions: {
        create: questions.map((q, index) => ({
          text: q.text,
          type: q.type,
          options: q.options,
          orderIndex: index + 1
        }))
      }
    }
  });
}

function createResponseValue(questionType, index) {
  const responses = [
    { selectedOption: '4' }, // Likert
    { text: 'Quiet space with visual aids' }, // Open-ended
    { selectedOption: '5' }, // Likert
    { selectedOptions: ['2', '4'] } // Multiple choice
  ];
  return responses[index % responses.length];
}

const likertOptions = [
  { id: '1', text: 'Strongly Disagree', value: 1 },
  { id: '2', text: 'Disagree', value: 2 },
  { id: '3', text: 'Neutral', value: 3 },
  { id: '4', text: 'Agree', value: 4 },
  { id: '5', text: 'Strongly Agree', value: 5 }
];

const careerOptions = [
  { id: '1', text: 'Scientific research', value: 1 },
  { id: '2', text: 'Artistic creation', value: 2 },
  { id: '3', text: 'Social service', value: 3 },
  { id: '4', text: 'Technical analysis', value: 4 }
];

async function generateStudentReports(students) {
  for (const student of students) {
    await prisma.report.create({
      data: {
        studentId: student.id,
        data: {
          strengths: ['Analytical thinking', 'Creativity'],
          recommendations: ['Explore STEM programs', 'Join art club'],
          personalityType: student.grade % 2 === 0 ? 'Type A' : 'Type B'
        }
      }
    });
  }
}

async function generateSchoolReports(schools) {
  for (const school of schools) {
    await prisma.schoolReport.create({
      data: {
        schoolId: school.id,
        type: SchoolReportType.GRADE_WISE,
        data: {
          totalStudents: 150,
          averageScores: {
            math: 78,
            science: 82,
            arts: 85
          }
        }
      }
    });
    
    await prisma.schoolReport.create({
      data: {
        schoolId: school.id,
        type: SchoolReportType.YEARLY,
        data: {
          academicYear: new Date().getFullYear(),
          graduationRate: 96,
          collegeAcceptance: 89
        }
      }
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
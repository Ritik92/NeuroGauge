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
  const systemAdminPassword = await hash('121245', 10);
  await prisma.user.create({
    data: {
      email: 'system@admin.com',
      password: systemAdminPassword,
      role: 'SYSTEM_ADMIN'
    }
  });

  // Create schools
  const schools = await Promise.all([
    createSchool('Springfield High School', 'admin@springfield.edu', 'IL'),
    createSchool('Oakridge International', 'admin@oakridge.edu', 'NY'),
    createSchool('Green Valley Academy', 'admin@greenvalley.edu', 'CA')
  ]);

  // Create parents (10 parents)
  const parents = await Promise.all([
    ...Array.from({ length: 10 }, (_, i) => 
      createParent(`parent${i+1}@example.com`, `Parent${i+1}`, `LastName${i+1}`, `(555) 111-000${i}`)
    )
  ]);

  // Create students (5 per school)
 // In the student creation loop (replace the existing student creation code)
const students = [];
for (const [schoolIndex, school] of schools.entries()) {
  const schoolPrefix = school.school.name.toLowerCase().replace(/ /g, '');
  const schoolStudents = await Promise.all(
    Array.from({ length: 5 }, (_, i) => {
      const studentNumber = schoolIndex * 5 + i + 1;
      const parentIds = [
        parents[i*2].id,
        parents[i*2+1].id
      ].filter(id => id);
      
      return createStudent(
        `student${studentNumber}@${schoolPrefix}.edu`, // Unique email based on school and student number
        `Student${studentNumber}`,
        `SLastName${studentNumber}`,
        `200${Math.floor(Math.random() * 5) + 5}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        Math.floor(Math.random() * 4) + 9,
        school.school.id,
        parentIds
      );
    })
  );
  students.push(...schoolStudents);
}

  // Create assessments (6 assessments)
  const assessments = await Promise.all([
    createAssessment('Learning Style Assessment', 'Determine learning preferences', AssessmentType.LEARNING_STYLE, 
      generateQuestions(5, QuestionType.LIKERT_SCALE, likertOptions)
    ),
    createAssessment('Career Aptitude Test', 'Identify suitable career paths', AssessmentType.APTITUDE, 
      [
        ...generateQuestions(3, QuestionType.LIKERT_SCALE, likertOptions),
        ...generateQuestions(2, QuestionType.MULTIPLE_CHOICE, careerOptions)
      ]
    ),
    createAssessment('Personality Assessment', 'Big Five personality traits evaluation', AssessmentType.PERSONALITY,
      generateQuestions(10, QuestionType.LIKERT_SCALE, likertOptions)
    ),
    createAssessment('Math Skills Test', 'Evaluate mathematical reasoning', AssessmentType.APTITUDE,
      [
        ...generateQuestions(5, QuestionType.MULTIPLE_CHOICE, mathOptions),
        { text: 'Explain your approach to solving complex math problems', type: QuestionType.OPEN_ENDED }
      ]
    ),
    createAssessment('Language Proficiency', 'Assess reading and writing skills', AssessmentType.LEARNING_STYLE,
      [
        ...generateQuestions(4, QuestionType.LIKERT_SCALE, likertOptions),
        { text: 'Write a short essay about your favorite book', type: QuestionType.OPEN_ENDED }
      ]
    )
  ]);

  // Create responses for each student
  for (const student of students) {
    for (const assessment of assessments) {
      const questions = await prisma.question.findMany({
        where: { assessmentId: assessment.id }
      });

      await prisma.response.createMany({
        data: questions.map(question => ({
          value: createResponseValue(question.type),
          studentId: student.id,
          assessmentId: assessment.id,
          questionId: question.id
        }))
      });
    }
  }

  // Generate reports
  await generateStudentReports(students);
  await generateSchoolReports(schools.map(s => s.school));

  console.log('Seed data created successfully!');
}

// Helper functions
async function createSchool(name, adminEmail, state) {
  const password = await hash('121245', 10);
  return prisma.user.create({
    data: {
      email: adminEmail,
      password,
      role: 'SCHOOL_ADMIN',
      school: {
        create: {
          name,
          address: `${Math.floor(Math.random() * 1000)} Education Lane`,
          city: name.split(' ')[0],
          state,
          country: 'USA',
          phone: `(555) 555-${Math.floor(1000 + Math.random() * 9000)}`,
          adminFirstName: 'Admin',
          adminLastName: name.split(' ')[0]
        }
      }
    },
    include: { school: true }
  });
}

async function createParent(email, firstName, lastName, phone) {
  const password = await hash('121245', 10);
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
  const password = await hash('121245', 10);
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
          text: q.text || `Question ${index + 1} about ${title}`,
          type: q.type,
          options: q.options || [],
          orderIndex: index + 1
        }))
      }
    }
  });
}

function generateQuestions(count, type, options) {
  return Array.from({ length: count }, (_, i) => ({
    text: `Sample question ${i + 1} for ${type}`,
    type,
    options
  }));
}

function createResponseValue(questionType) {
  const randomOption = (options) => 
    options[Math.floor(Math.random() * options.length)].id;

  switch(questionType) {
    case QuestionType.LIKERT_SCALE:
      return { selectedOption: randomOption(likertOptions) };
    case QuestionType.MULTIPLE_CHOICE:
      return { selectedOptions: [randomOption(careerOptions), randomOption(careerOptions)] };
    case QuestionType.OPEN_ENDED:
      return { text: 'Sample open-ended response generated at ' + new Date().toISOString() };
    default:
      return { text: 'Default response' };
  }
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

const mathOptions = [
  { id: '1', text: 'Algebra', value: 1 },
  { id: '2', text: 'Geometry', value: 2 },
  { id: '3', text: 'Calculus', value: 3 },
  { id: '4', text: 'Statistics', value: 4 }
];

async function generateStudentReports(students) {
  const strengths = ['Analytical', 'Creative', 'Organized', 'Collaborative', 'Persistent'];
  const recommendations = ['Advanced courses', 'Tutoring', 'Extracurricular activities', 'Mentorship'];
  
  for (const student of students) {
    await prisma.report.create({
      data: {
        studentId: student.id,
        data: {
          strengths: [strengths[Math.floor(Math.random() * strengths.length)], strengths[Math.floor(Math.random() * strengths.length)]],
          recommendations: [recommendations[Math.floor(Math.random() * recommendations.length)]],
          personalityType: ['Type A', 'Type B', 'Type C'][Math.floor(Math.random() * 3)],
          averageScore: Math.floor(Math.random() * 40 + 60)
        }
      }
    });
  }
}

async function generateSchoolReports(schools) {
  for (const school of schools) {
    // Create multiple reports per school
    await prisma.schoolReport.createMany({
      data: [{
        schoolId: school.id,
        type: SchoolReportType.GRADE_WISE,
        data: {
          totalStudents: Math.floor(Math.random() * 100 + 100),
          averageScores: {
            math: Math.floor(Math.random() * 40 + 60),
            science: Math.floor(Math.random() * 40 + 60),
            arts: Math.floor(Math.random() * 40 + 60)
          }
        }
      }, {
        schoolId: school.id,
        type: SchoolReportType.YEARLY,
        data: {
          academicYear: new Date().getFullYear(),
          graduationRate: Math.floor(Math.random() * 20 + 80),
          collegeAcceptance: Math.floor(Math.random() * 20 + 75)
        }
      }]
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
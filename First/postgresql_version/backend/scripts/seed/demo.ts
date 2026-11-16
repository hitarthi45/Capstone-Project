import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

// Guard: ensure test environment
if (process.env.NODE_ENV !== 'test' && !(process.env.DATABASE_URL?.includes('_test'))) {
  console.error('Abort: not a test environment');
  process.exit(1);
}

// Deterministic faker seed
faker.seed(12345);

const prisma = new PrismaClient();

async function main() {
  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: 'hashed_admin_password', // assume seeding already hashed
      role: 'ADMIN',
      name: 'Admin User',
    },
  });

  // Departments
  const departments = await prisma.department.createMany({
    data: [
      { name: 'Computer Engineering' },
      { name: 'Mechanical Engineering' },
    ],
    skipDuplicates: true,
  });

  // HODs and faculty per department (6 each)
  const deptRecords = await prisma.department.findMany();
  for (const dept of deptRecords) {
    // HOD
    await prisma.user.upsert({
      where: { email: `${dept.name.replace(/\s+/g, '_').toLowerCase()}_hod@example.com` },
      update: {},
      create: {
        email: `${dept.name.replace(/\s+/g, '_').toLowerCase()}_hod@example.com`,
        passwordHash: 'hashed_hod_password',
        role: 'HOD',
        name: `${dept.name} HOD`,
        departmentId: dept.id,
      },
    });
    // Faculty
    for (let i = 1; i <= 6; i++) {
      await prisma.user.upsert({
        where: { email: `${dept.name.replace(/\s+/g, '_').toLowerCase()}_faculty${i}@example.com` },
        update: {},
        create: {
          email: `${dept.name.replace(/\s+/g, '_').toLowerCase()}_faculty${i}@example.com`,
          passwordHash: 'hashed_faculty_password',
          role: 'FACULTY',
          name: `${dept.name} Faculty ${i}`,
          departmentId: dept.id,
        },
      });
    }
  }

  // Programs, semesters, courses (simplified)
  const programs = await prisma.program.createMany({
    data: [
      { code: 'CE', name: 'Computer Engineering' },
      { code: 'ME', name: 'Mechanical Engineering' },
    ],
    skipDuplicates: true,
  });

  const semesters = await prisma.semester.createMany({
    data: [
      { number: 1 },
      { number: 2 },
      { number: 3 },
      { number: 4 },
    ],
    skipDuplicates: true,
  });

  // Courses (20 total, mix core/elective/lab)
  const courseData = [] as any[];
  for (let i = 1; i <= 20; i++) {
    const type = i % 3 === 0 ? 'LAB' : i % 2 === 0 ? 'ELECTIVE' : 'CORE';
    courseData.push({ code: `C${i.toString().padStart(3, '0')}`, name: `Course ${i}`, type });
  }
  await prisma.course.createMany({ data: courseData, skipDuplicates: true });

  // Sample users for manual login (list in README later)
  const sampleUsers = [
    { email: 'faculty1@example.com', passwordHash: 'hashed_pw1', role: 'FACULTY', name: 'Faculty One' },
    { email: 'hod_ce@example.com', passwordHash: 'hashed_pw2', role: 'HOD', name: 'HOD CE' },
    { email: 'admin@example.com', passwordHash: 'hashed_pw3', role: 'ADMIN', name: 'Admin' },
  ];
  for (const u of sampleUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
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

// prisma/seed.test.ts
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
    const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12');
    const plainPw = 'Test@1234';
    const hash = await bcrypt.hash(plainPw, SALT_ROUNDS);
    // 1️⃣  ADMIN
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@test.com',
            passwordHash: hash,
            role: Role.ADMIN,
            isActive: true,
        },
    });
    // 2️⃣  DEPARTMENTS
    const ceDept = await prisma.department.upsert({
        where: { code: 'CE' },
        update: {},
        create: {
            name: 'Computer Engineering',
            code: 'CE',
        },
    });
    const meDept = await prisma.department.upsert({
        where: { code: 'ME' },
        update: {},
        create: {
            name: 'Mechanical Engineering',
            code: 'ME',
        },
    });
    // 3️⃣  HODs (one per department)
    const hodCE = await prisma.user.upsert({
        where: { email: 'hod.ce@test.com' },
        update: {},
        create: {
            name: 'HOD Computer Eng',
            email: 'hod.ce@test.com',
            passwordHash: hash,
            role: Role.HOD,
            departmentId: ceDept.id,
            isActive: true,
        },
    });
    const hodME = await prisma.user.upsert({
        where: { email: 'hod.me@test.com' },
        update: {},
        create: {
            name: 'HOD Mechanical Eng',
            email: 'hod.me@test.com',
            passwordHash: hash,
            role: Role.HOD,
            departmentId: meDept.id,
            isActive: true,
        },
    });
    // 4️⃣  FACULTY (6 per department)
    const facultyCE: any[] = [];
    for (let i = 1; i <= 6; i++) {
        const email = `faculty${i}.ce@test.com`;
        const fac = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name: `Faculty CE ${i}`,
                email,
                passwordHash: hash,
                role: Role.FACULTY,
                departmentId: ceDept.id,
                isActive: true,
            },
        });
        facultyCE.push(fac);
    }
    const facultyME: any[] = [];
    for (let i = 1; i <= 6; i++) {
        const email = `faculty${i}.me@test.com`;
        const fac = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                name: `Faculty ME ${i}`,
                email,
                passwordHash: hash,
                role: Role.FACULTY,
                departmentId: meDept.id,
                isActive: true,
            },
        });
        facultyME.push(fac);
    }
    // 5️⃣  PROGRAMS (2)
    const progCE = await prisma.program.create({
        data: {
            name: 'B.Tech Computer Engineering',
            departmentId: ceDept.id,
        },
    });
    const progME = await prisma.program.create({
        data: {
            name: 'B.Tech Mechanical Engineering',
            departmentId: meDept.id,
        },
    });
    // 6️⃣  SEMESTERS (2 per program)
    const semCE1 = await prisma.semester.create({
        data: {
            number: 1,
            academicYear: '2025-2026',
            programId: progCE.id,
        },
    });
    const semCE2 = await prisma.semester.create({
        data: {
            number: 2,
            academicYear: '2025-2026',
            programId: progCE.id,
        },
    });
    const semME1 = await prisma.semester.create({
        data: {
            number: 1,
            academicYear: '2025-2026',
            programId: progME.id,
        },
    });
    const semME2 = await prisma.semester.create({
        data: {
            number: 2,
            academicYear: '2025-2026',
            programId: progME.id,
        },
    });
    // 7️⃣  COURSES (20 – 10 per department, mix of core/elective/lab)
    const courseData = [
        // Computer Eng
        { code: 'CE301', title: 'Data Structures', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE1.id, departmentId: ceDept.id },
        { code: 'CE302', title: 'Algorithms', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE1.id, departmentId: ceDept.id },
        { code: 'CE303', title: 'Operating Systems', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE304', title: 'Computer Networks', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE305', title: 'Database Systems', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE306', title: 'Embedded Systems', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE307', title: 'AI Fundamentals', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE308', title: 'Software Engineering Lab', type: 'LAB', credits: 2, L: 0, T: 0, P: 2, semesterId: semCE2.id, departmentId: ceDept.id },
        { code: 'CE309', title: 'Digital Design', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semCE1.id, departmentId: ceDept.id },
        { code: 'CE310', title: 'Microprocessors', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semCE1.id, departmentId: ceDept.id },
        // Mechanical Eng
        { code: 'ME301', title: 'Thermodynamics', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME1.id, departmentId: meDept.id },
        { code: 'ME302', title: 'Fluid Mechanics', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME1.id, departmentId: meDept.id },
        { code: 'ME303', title: 'Strength of Materials', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME304', title: 'Machine Design', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME305', title: 'Manufacturing Processes', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME306', title: 'CAD/CAM', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME307', title: 'Robotics', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME308', title: 'Materials Lab', type: 'LAB', credits: 2, L: 0, T: 0, P: 2, semesterId: semME2.id, departmentId: meDept.id },
        { code: 'ME309', title: 'Heat Transfer', type: 'CORE', credits: 4, L: 3, T: 1, P: 0, semesterId: semME1.id, departmentId: meDept.id },
        { code: 'ME310', title: 'Vibration Analysis', type: 'ELECTIVE', credits: 3, L: 2, T: 1, P: 0, semesterId: semME1.id, departmentId: meDept.id },
    ];
    for (const c of courseData) {
        await prisma.course.upsert({
            where: { code: c.code },
            update: {},
            create: c,
        });
    }
    // 8️⃣  COURSE ASSIGNMENTS (assign each faculty to a random course)
    const allCourses = await prisma.course.findMany();
    const allFaculty = [...facultyCE, ...facultyME];
    for (const faculty of allFaculty) {
        // pick a random course from the same department
        const deptCourses = allCourses.filter(
            (cc: any) => cc.code.startsWith(faculty.departmentId === ceDept.id ? 'CE' : 'ME')
        );
        const randomCourse = deptCourses[Math.floor(Math.random() * deptCourses.length)];
        await prisma.courseAssignment.create({
            data: {
                facultyId: faculty.id,
                courseId: randomCourse.id,
                academicYear: '2025-2026',
            },
        });
    }
    console.log('✅ Test data seeded successfully');
}
main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
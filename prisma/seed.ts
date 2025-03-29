const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.teamMember.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.note.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create demo users
  console.log('Creating users...');
  const adminPassword = await hash('admin123', 10);
  const userPassword = await hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Create goals for the demo user
  console.log('Creating goals...');
  const healthGoal = await prisma.goal.create({
    data: {
      title: 'Improve Health',
      description: 'Focus on physical and mental wellbeing this year',
      startDate: new Date(2024, 0, 1), // January 1, 2024
      endDate: new Date(2024, 11, 31), // December 31, 2024
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user.id,
    },
  });

  const careerGoal = await prisma.goal.create({
    data: {
      title: 'Advance Career',
      description: 'Take steps to grow professionally',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user.id,
    },
  });

  const learningGoal = await prisma.goal.create({
    data: {
      title: 'Continuous Learning',
      description: 'Learn new skills and expand knowledge',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 11, 31),
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      userId: user.id,
    },
  });

  // Create projects
  console.log('Creating projects...');
  const fitnessProject = await prisma.project.create({
    data: {
      title: 'Fitness Routine',
      description: 'Establish a consistent workout routine',
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 3, 15),
      status: 'IN_PROGRESS',
      userId: user.id,
      goalId: healthGoal.id,
    },
  });

  const certificationProject = await prisma.project.create({
    data: {
      title: 'Professional Certification',
      description: 'Obtain industry certification to enhance resume',
      startDate: new Date(2024, 1, 1),
      endDate: new Date(2024, 5, 30),
      status: 'IN_PROGRESS',
      userId: user.id,
      goalId: careerGoal.id,
    },
  });

  // Create tasks
  console.log('Creating tasks...');
  
  // Health tasks
  await prisma.task.create({
    data: {
      title: 'Research gym memberships',
      description: 'Find affordable options in the local area',
      dueDate: new Date(2024, 0, 20),
      status: 'COMPLETED',
      priority: 'MEDIUM',
      userId: user.id,
      goalId: healthGoal.id,
      projectId: fitnessProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Create workout plan',
      description: 'Design a balanced weekly routine',
      dueDate: new Date(2024, 0, 25),
      status: 'COMPLETED',
      priority: 'HIGH',
      userId: user.id,
      goalId: healthGoal.id,
      projectId: fitnessProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Schedule annual physical',
      description: 'Book appointment with primary care physician',
      dueDate: new Date(2024, 1, 15),
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
      goalId: healthGoal.id,
    },
  });

  // Career tasks
  await prisma.task.create({
    data: {
      title: 'Register for certification exam',
      description: 'Pay fee and schedule test date',
      dueDate: new Date(2024, 1, 10),
      status: 'COMPLETED',
      priority: 'HIGH',
      userId: user.id,
      goalId: careerGoal.id,
      projectId: certificationProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Complete study guide',
      description: 'Work through all practice materials',
      dueDate: new Date(2024, 3, 1),
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: user.id,
      goalId: careerGoal.id,
      projectId: certificationProject.id,
    },
  });

  await prisma.task.create({
    data: {
      title: 'Update resume',
      description: 'Refresh content with recent accomplishments',
      dueDate: new Date(2024, 2, 15),
      status: 'TODO',
      priority: 'MEDIUM',
      userId: user.id,
      goalId: careerGoal.id,
    },
  });

  // Learning tasks
  await prisma.task.create({
    data: {
      title: 'Read 12 books this year',
      description: 'Focus on professional development and personal growth topics',
      dueDate: new Date(2024, 11, 31),
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      userId: user.id,
      goalId: learningGoal.id,
    },
  });

  // Create notes
  console.log('Creating notes...');
  await prisma.note.create({
    data: {
      title: 'Workout Options',
      content: 'Comparing gym membership costs:\n- Planet Fitness: $10/month\n- Gold\'s Gym: $30/month\n- Local rec center: $25/month\n\nBest value seems to be Planet Fitness for basic needs.',
      userId: user.id,
      projectId: fitnessProject.id,
    },
  });

  await prisma.note.create({
    data: {
      title: 'Certification Study Plan',
      content: 'Week 1-2: Fundamentals\nWeek 3-4: Advanced concepts\nWeek 5-6: Practice exams\nWeek 7-8: Review weak areas\n\nSchedule 2 hours daily for studying.',
      userId: user.id,
      projectId: certificationProject.id,
    },
  });

  // Create events
  console.log('Creating events...');
  await prisma.event.create({
    data: {
      title: 'Gym Session',
      description: 'Focus on upper body',
      startTime: new Date(2024, 1, 1, 18, 0), // Feb 1, 2024, 6:00 PM
      endTime: new Date(2024, 1, 1, 19, 30), // Feb 1, 2024, 7:30 PM
      userId: user.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Certification Exam',
      description: 'Arrive 30 minutes early with ID',
      startTime: new Date(2024, 5, 15, 10, 0), // June 15, 2024, 10:00 AM
      endTime: new Date(2024, 5, 15, 13, 0), // June 15, 2024, 1:00 PM
      location: 'Test Center, 123 Main St',
      userId: user.id,
    },
  });

  // Create resources
  console.log('Creating resources...');
  await prisma.resource.create({
    data: {
      title: 'Workout Routine PDF',
      type: 'FILE',
      url: '/files/workout_routine.pdf',
      userId: user.id,
      projectId: fitnessProject.id,
    },
  });

  await prisma.resource.create({
    data: {
      title: 'Certification Study Guide',
      type: 'LINK',
      url: 'https://example.com/certification-guide',
      userId: user.id,
      projectId: certificationProject.id,
    },
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
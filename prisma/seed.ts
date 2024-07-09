import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function main() {
  // Criar usuários
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.user.create({
        data: {
          username: faker.person.fullName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        },
      });
    })
  );

  // Criar projetos
  const projects = await Promise.all(
    users.map(async (user) => {
      return prisma.project.create({
        data: {
          name: faker.company.name(),
          description: faker.lorem.paragraph(),
          userId: user.id,
        },
      });
    })
  );

  // Criar tarefas
  const tasks = await Promise.all(
    projects.map(async (project) => {
      const user = users[Math.floor(Math.random() * users.length)];
      return prisma.task.create({
        data: {
          title: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement([
            "pending",
            "in-progress",
            "completed",
          ]),
          projectId: project.id,
          userId: user.id,
        },
      });
    })
  );

  // Criar comentários
  await Promise.all(
    tasks.map(async (task) => {
      return prisma.comment.create({
        data: {
          content: faker.lorem.sentence(),
          taskId: task.id,
          userId: task.userId,
        },
      });
    })
  );

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

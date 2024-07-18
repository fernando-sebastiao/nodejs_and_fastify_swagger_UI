"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middleware/checkdatabase.ts
var checkdatabase_exports = {};
__export(checkdatabase_exports, {
  default: () => checkdatabase_default
});
module.exports = __toCommonJS(checkdatabase_exports);

// prisma/seed.ts
var import_faker = require("@faker-js/faker");
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();
async function main() {
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return prisma.user.create({
        data: {
          username: import_faker.faker.person.fullName(),
          password: import_faker.faker.internet.password(),
          email: import_faker.faker.internet.email()
        }
      });
    })
  );
  const projects = await Promise.all(
    users.map(async (user) => {
      return prisma.project.create({
        data: {
          name: import_faker.faker.company.name(),
          description: import_faker.faker.lorem.paragraph(),
          userId: user.id
        }
      });
    })
  );
  const tasks = await Promise.all(
    projects.map(async (project) => {
      const user = users[Math.floor(Math.random() * users.length)];
      return prisma.task.create({
        data: {
          title: import_faker.faker.lorem.sentence(),
          description: import_faker.faker.lorem.paragraph(),
          status: import_faker.faker.helpers.arrayElement([
            "pending",
            "in-progress",
            "completed"
          ]),
          projectId: project.id,
          userId: user.id
        }
      });
    })
  );
  await Promise.all(
    tasks.map(async (task) => {
      return prisma.comment.create({
        data: {
          content: import_faker.faker.lorem.sentence(),
          taskId: task.id,
          userId: task.userId
        }
      });
    })
  );
  console.log("Seed data created successfully");
}
main().catch((e) => {
  console.error(e);
  throw e;
}).finally(async () => {
  await prisma.$disconnect();
});

// src/lib/db.ts
var import_client2 = require("@prisma/client");
var db = new import_client2.PrismaClient({ log: ["query"] });

// src/middleware/checkdatabase.ts
var checkDatabase = async function() {
  const UserCount = await db.user.count();
  const CommentCount = await db.comment.count();
  const ProjectCount = await db.project.count();
  const TaskCount = await db.task.count();
  if (UserCount === 0 || CommentCount === 0 || ProjectCount === 0 || TaskCount === 0) {
    await main();
  }
};
var checkdatabase_default = checkDatabase;

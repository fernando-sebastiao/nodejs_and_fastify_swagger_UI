"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/controllers/TaskController.ts
var TaskController_exports = {};
__export(TaskController_exports, {
  createTasks: () => createTasks,
  deleteTask: () => deleteTask,
  filterTasks: () => filterTasks,
  getTaskbyId: () => getTaskbyId,
  getallTasks: () => getallTasks,
  updateTasks: () => updateTasks
});
module.exports = __toCommonJS(TaskController_exports);
var import_zod = __toESM(require("zod"));

// src/error/client-error.ts
var ClientError = class extends Error {
};

// src/lib/db.ts
var import_client = require("@prisma/client");
var db = new import_client.PrismaClient({ log: ["query"] });

// src/controllers/TaskController.ts
async function createTasks(app) {
  app.withTypeProvider().post(
    "/tasks/create",
    {
      schema: {
        body: import_zod.default.object({
          title: import_zod.default.string(),
          description: import_zod.default.string().optional(),
          status: import_zod.default.enum(["pending", "in-progress", "completed"], {
            message: "Status must be pending, in-progress, or completed"
          }).default("pending"),
          projectId: import_zod.default.number(),
          userId: import_zod.default.number()
        })
      }
    },
    async (request, replay) => {
      const { title, description, status, projectId, userId } = request.body;
      const verifyProject = await db.project.findFirst({
        where: { id: projectId }
      });
      if (!verifyProject) {
        throw new ClientError("This projectId does not exist");
      }
      const verifyUser = await db.user.findFirst({
        where: { id: userId }
      });
      if (!verifyUser) {
        throw new ClientError("This User does not exist");
      }
      const task = await db.task.create({
        data: {
          title,
          description,
          projectId,
          userId,
          status
        }
      });
      return replay.code(201).send({ message: "User created successfully", task });
    }
  );
}
async function getallTasks(app) {
  app.withTypeProvider().get(
    "/tasks",
    {
      schema: {
        description: "Get all Tasks",
        tags: ["Task"]
      }
    },
    async (req, res) => {
      const task = await db.task.findMany({
        orderBy: {
          id: "asc"
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      return res.code(200).send(task);
    }
  );
}
async function deleteTask(app) {
  app.withTypeProvider().delete(
    "/tasks/delete/:id",
    {
      schema: {
        params: import_zod.default.object({
          id: import_zod.default.number()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.delete({
        where: {
          id
        }
      });
      return res.code(200).send({ message: "Task deleted successfully", task });
    }
  );
}
async function getTaskbyId(app) {
  app.withTypeProvider().get(
    "/tasks/:id",
    {
      schema: {
        params: import_zod.default.object({
          id: import_zod.default.number()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      return res.code(200).send(task);
    }
  );
}
async function updateTasks(app) {
  app.withTypeProvider().put(
    "/tasks/update/:id",
    {
      schema: {
        params: import_zod.default.object({
          id: import_zod.default.number()
        }),
        body: import_zod.default.object({
          title: import_zod.default.string().optional(),
          description: import_zod.default.string().optional(),
          status: import_zod.default.enum(["pending", "in-progress", "completed"], {
            message: "Status must be pending, in-progress, or completed"
          }).optional(),
          projectId: import_zod.default.number().optional(),
          userId: import_zod.default.number().optional()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const { title, description, status, projectId, userId } = req.body;
      const task = await db.task.findUnique({
        where: {
          id
        }
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      const updateTask = await db.task.update({
        where: {
          id
        },
        data: {
          title: title || task.title,
          description: description || task.description,
          status: status || task.status,
          projectId: projectId || task.projectId,
          userId: userId || task.userId
        }
      });
      return res.code(200).send({ message: "Task updated successfully", updateTask });
    }
  );
}
async function filterTasks(app) {
  app.withTypeProvider().get(
    "/tasks/filter",
    {
      schema: {
        querystring: import_zod.default.object({
          status: import_zod.default.string().optional(),
          projectId: import_zod.default.number().optional(),
          userId: import_zod.default.number().optional()
        })
      }
    },
    async (req, res) => {
      const { status, projectId, userId } = req.query;
      const task = await db.task.findMany({
        where: {
          status,
          projectId,
          userId
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      return res.code(200).send(task);
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createTasks,
  deleteTask,
  filterTasks,
  getTaskbyId,
  getallTasks,
  updateTasks
});

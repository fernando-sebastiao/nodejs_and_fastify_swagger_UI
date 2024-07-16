import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../lib/db";
import { ClientError } from "../error/client-error";
import { title } from "process";

export async function createTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/tasks/create",
    {
      schema: {
        body: z.object({
          title: z.string(),
          description: z.string().optional(),
          status: z
            .enum(["pending", "in-progress", "completed"], {
              message: "Status must be pending, in-progress, or completed",
            })
            .default("pending"),
          projectId: z.number(),
          userId: z.number(),
        }),
      },
    },
    async (request, replay) => {
      const { title, description, status, projectId, userId } = request.body;

      //verificar project
      const verifyProject = await db.project.findFirst({
        where: { id: projectId },
      });
      if (!verifyProject) {
        throw new ClientError("This projectId does not exist");
      }
      //verificar user
      const verifyUser = await db.user.findFirst({
        where: { id: userId },
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
          status,
        },
      });
      return replay
        .code(201)
        .send({ message: "User created successfully", task });
    }
  );
}

//getall Tasks
export async function getallTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/tasks",
    {
      schema: {
        description: "Get all Tasks",
        tags: ["Task"],
      },
    },
    async (req, res) => {
      const task = await db.task.findMany({
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          projectId: true,
        },
      });
      return res.code(200).send(task);
    }
  );
}
//rota para deletar tasks
export async function deleteTask(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/tasks/delete/:id",
    {
      schema: {
        params: z.object({
          id: z.number(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.delete({
        where: {
          id,
        },
      });
      return res.code(200).send({ message: "Task deleted successfully", task });
    }
  );
}
//rota para update tasks

export async function getTaskbyId(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/tasks/:id",
    {
      schema: {
        params: z.object({
          id: z.number(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          projectId: true,
        },
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      return res.code(200).send(task);
    }
  );
}
//update tasks
export async function updateTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/tasks/update/:id",
    {
      schema: {
        params: z.object({
          id: z.number(),
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          status: z
            .enum(["pending", "in-progress", "completed"], {
              message: "Status must be pending, in-progress, or completed",
            })
            .optional(),
          projectId: z.number().optional(),
          userId: z.number().optional(),
        }),
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const { title, description, status, projectId, userId } = req.body;

      const task = await db.task.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      const updateTask = await db.task.update({
        where: {
          id,
        },
        data: {
          title: title || task.title,
          description: description || task.description,
          status: status || task.status,
          projectId: projectId || task.projectId,
          userId: userId || task.userId,
        },
      });
      return res
        .code(200)
        .send({ message: "Task updated successfully", updateTask });
    }
  );
}
//filter tasks by status, project and user
export async function filterTasks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/tasks/filter",
    {
      schema: {
        querystring: z.object({
          status: z.string().optional(),
          projectId: z.number().optional(),
          userId: z.number().optional(),
        }),
      },
    },
    async (req, res) => {
      const { status, projectId, userId } = req.query as {
        status?: string;
        projectId?: number;
        userId?: number;
      };
      const task = await db.task.findMany({
        where: {
          status,
          projectId,
          userId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true,
            },
          },
          projectId: true,
        },
      });
      return res.code(200).send(task);
    }
  );
}

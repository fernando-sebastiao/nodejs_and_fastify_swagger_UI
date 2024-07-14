import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../lib/db";
import { ClientError } from "../error/client-error";

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

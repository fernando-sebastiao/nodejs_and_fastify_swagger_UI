import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CustomError } from "../errors/CustomError";
import { db } from "../lib/db";

export class ProjectControler {
  async createproject(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/project", {
      schema: {
        description: "Create a new project",
        tags: ["Project"],
        body: z.object({
          name: z.string().min(4, { message: "name must have 4 caracter" }),
          description: z.string().min(4, { message: "description must" }),
          userId: z.number().int().positive(),
        }),
      },
      handler: async (request, reply) => {
        const { name, description, userId } = request.body;

        // Verificar se o email já existe
        const verificarUser = await db.user.findFirst({
          where: { id: userId },
        });

        if (!verificarUser) {
          throw new CustomError("This User does not exists", 400, [
            "User not found!",
          ]);
        }

        const project = await db.project.create({
          data: {
            name,
            description,
            userId,
          },
        });

        return reply.status(201).send(project);
      },
    });
  }
}

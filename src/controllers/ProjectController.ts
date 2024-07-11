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
        response: {
          201: {
            description: "Project created successfully",
            type: "object",
            properties: {
              name: { type: "string", example: "Go to the park" },
              description: {
                type: "string",
                example: "It´s so very good go over there!",
              },
              userId: { type: "number", example: "7bekndinindsfsfdf3dd34d" },
            },
          },
          400: {
            description: "Bad Request",
            type: "object",
            properties: {
              error: { type: "number", example: "invalid type Userid" },
            },
          },
        },
        examples: {
          success: {
            summary: "Successful user creation",
            value: {
              name: "something",
              description: "everthing is gonna well!",
              userId: "7b3433rfdwe3fwewdef3",
            },
          },
          error: {
            summary: "Project creation error",
            value: {
              error: "UserId not found",
            },
          },
        },
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

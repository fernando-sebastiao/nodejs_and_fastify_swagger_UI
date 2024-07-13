import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../error/client-error";
import { db } from "../lib/db";

export async function createproject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/project/create", {
    schema: {
      description: "Create a new project",
      tags: ["Project"],
      body: z.object({
        name: z
          .string({ message: "This field must receive type string!" })
          .min(4, { message: "name must have 4 caracter" }),
        description: z.string().min(4, { message: "description must" }),
        userId: z.number().int().positive(),
      }),
    },
    handler: async (request, reply) => {
      const { name, description, userId } = request.body;
      //verficar se o projecto já existe e esta atribuido a um usuario
      const verificarprojecto = await db.project.findFirst({
        where: {
          name,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });
      if (verificarprojecto?.user.id === userId) {
        throw new ClientError("This project is already authenticated");
      }
      // Verificar se o email já existe
      const verificarUser = await db.user.findFirst({
        where: { id: userId },
      });

      if (!verificarUser) {
        throw new ClientError("This User does not exists");
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

export async function getallProject(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/projects",
    {
      schema: {
        description: "Get all Project's",
        tags: ["Project"],
      },
    },
    async (req, res) => {
      const project = await db.project.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          userId: true,
          createdAt: true,
        },
      });
      return res.code(200).send(project);
    }
  );
}

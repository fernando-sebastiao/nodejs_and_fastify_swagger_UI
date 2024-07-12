import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { Schema } from "zod";
import { ClientError } from "../error/client-error";
import { db } from "../lib/db";

export async function createUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post("/user/create", {
    schema: {
      description: "Create a new user",
      tags: ["User"],
      body: z.object({
        username: z
          .string({ required_error: "Username is required" })
          .min(4, "The username must be at least 3 characters long"),
        password: z
          .string({ required_error: "Password is required" })
          .min(6, "Password must be at least 6 characters long"),
        email: z
          .string({ required_error: "Email is required" })
          .email("Invalid email format"),
      }),
    },
    handler: async (request, reply) => {
      const { username, password, email } = request.body;
      // Verificar se o email já existe
      const verificarnome = await db.user.findFirst({ where: { username } });
      if (verificarnome) {
        throw new ClientError("This username alreay exists!");
      }

      const verificaremail = await db.user.findUnique({
        where: { email },
      });
      if (verificaremail) {
        throw new ClientError("This email alreay exists!");
      }
      const user = await db.user.create({
        data: {
          username,
          password,
          email,
        },
      });

      return reply.status(201).send(user);
    },
  });
}

//pegar todos os users
export async function getallUsers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["User"],
      },
    },
    async (request, replay) => {
      const user = await db.user.findMany();

      return replay.code(200).send(user);
    }
  );
}

//consultar users
export async function getUserbyId(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/user/:userId",
    {
      schema: {
        params: z.object({
          userId: z
            .number({ message: "This field must receive number" })
            .int()
            .positive(),
        }),
      },
    },
    async (request, replay) => {
      const { userId } = request.params;

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
      if (!user) {
        throw new ClientError("User not found");
      }
      return replay.code(200).send(user);
    }
  );
}

//deletarUser
export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/user/:userId",
    {
      schema: {
        params: z.object({
          userId: z.number().int().positive(),
        }),
      },
    },
    async (request, response) => {
      const { userId } = request.params as { userId: number };

      const user = await db.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          projects: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      if (!user) {
        throw new ClientError("User not found!");
      }
      return response.code(200).send(user);
    }
  );
}
//tirando bugs
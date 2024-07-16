import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ClientError } from "../error/client-error";
import { db } from "../lib/db";
import { hash } from "crypto";
import bycrpt from "bcrypt";
import { errorHandler } from "../error-handler";

export async function createUser(app: FastifyInstance) {
  app.setErrorHandler(errorHandler);

  const createUserSchema = z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(4, "The username must be at least 4 characters long"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
  });

  app.withTypeProvider<ZodTypeProvider>().post("/user/create", {
    schema: {
      description: "Create a new user",
      tags: ["User"],
      body: createUserSchema,
    },
    handler: async (request, reply) => {
      // Verificar se o corpo da requisição está vazio
      if (!request.body) {
        throw new ClientError("Request body cannot be empty");
      }

      // Validar o corpo da requisição usando safeParse
      const parsed = createUserSchema.safeParse(request.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.errors
          .map((err) => `${err.path.join(".")} - ${err.message}`)
          .join(", ");
        throw new ClientError(`Validation failed: ${errorMessages}`);
      }

      const { username, password, email } = parsed.data;

      // Verificar se o username já existe
      const verificarnome = await db.user.findFirst({ where: { username } });
      if (verificarnome) {
        throw new ClientError("This username already exists!");
      }

      // Verificar se o email já existe
      const verificaremail = await db.user.findUnique({ where: { email } });
      if (verificaremail) {
        throw new ClientError("This email already exists!");
      }

      // Criptografar a senha
      const hashPassword = await bycrpt.hash(password, 8);

      // Criar o usuário
      const user = await db.user.create({
        data: {
          username,
          password: hashPassword,
          email,
        },
      });

      return reply.status(201).send({
        data: [{ username: user.username, email: user.email }],
      });
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
            .string({ message: "This field must receive number" })
            .transform((valor) => {
              const dados = Number(valor);
              if (isNaN(dados) || dados <= 0) {
                throw new ClientError(
                  "This field must receive a positive number"
                );
              }
              return dados;
            }),
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
//deletar usuário
export async function deleteUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/user/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid userId");
            }
            return num;
          }),
        }),
      },
    },
    async (request, response) => {
      const { userId } = request.params as { userId: number };

      // Primeiro, verificar se o usuário existe
      const verificar = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true },
      });

      if (!verificar) {
        throw new ClientError("User not found!");
      }

      // Deletar o usuário
      const deletedUser = await db.user.delete({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      return response.code(200).send(deletedUser);
    }
  );
}
//atualizar user
export async function updateUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/user/:userId",
    {
      schema: {
        params: z.object({
          userId: z.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid userId");
            }
            return num;
          }),
        }),
        body: z.object({
          username: z.string({
            message: "This field must receive string",
            required_error: "This field cannot be empty!",
          }),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, response) => {
      const { userId } = request.params;
      const { username, password, email } = request.body;

      //verificar se o userId existe
      const verificar = await db.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!verificar) {
        throw new ClientError("User not found!");
      }
      const updatingUser = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          username,
          password,
          email,
        },
      });
      return response.code(200).send({
        username: updatingUser.username,
        email: updatingUser.email,
      });
    }
  );
}
//filter user
export async function filterUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/user/filter",
    {
      schema: {
        querystring: z.object({
          username: z.string().optional(),
          email: z.string().email().optional(),
        }),
      },
    },
    async (request, response) => {
      const { username, email } = request.query;

      const user = await db.user.findMany({
        where: {
          username: {
            contains: username,
          },
          email: {
            contains: email,
          },
        },
      });

      return response.code(200).send(user);
    }
  );
}

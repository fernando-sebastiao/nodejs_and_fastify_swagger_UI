import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
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

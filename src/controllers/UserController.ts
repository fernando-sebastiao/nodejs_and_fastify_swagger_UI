import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../lib/db";

export class UserController {
  async createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/user", {
      schema: {
        description: "Create a new user",
        tags: ["User"],
        body: z.object({
          username: z
            .string({ required_error: "Username is required" })
            .min(4, "The username must be at least 5 characters long"),
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
        const verificarEmail = await db.user.findUniqueOrThrow({
          where: { email },
        });

        if (verificarEmail) {
          throw new Error("This email already exists!");
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
}

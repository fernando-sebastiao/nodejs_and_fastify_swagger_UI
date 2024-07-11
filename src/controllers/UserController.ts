import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CustomError } from "../errors/CustomError";
import { db } from "../lib/db";
export class UserController {
  async createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post("/user", {
      schema: {
        description: "Create a new user",
        tags: ["User"],
        body: z.object({
          username: z
            .string()
            .min(5, "The username must be at least 5 characters"),
          password: z.string().min(6),
          email: z.string().email({ message: "Invalid email" }),
        }),
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              message: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
          400: {
            description: "Bad Request",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
      handler: async (request, reply) => {
        const { username, password, email } = request.body as {
          username: string;
          password: string;
          email: string;
        };
        // Verificar se o nome de usuário já existe
        const verificarEmail = await db.user.findFirst({
          where: { email },
        });
        if (verificarEmail) {
          throw new CustomError("This email already exists", 400, [
            "This type of email already exists!",
          ]);
        }
        const user = await db.user.create({
          data: {
            username,
            password,
            email,
          },
        });
        return reply.status(201).send({ message: "User created", user });
      },
    });
  }
}

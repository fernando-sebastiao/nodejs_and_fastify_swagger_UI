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
            .string({ required_error: "Username is required" })
            .min(5, "The username must be at least 5 characters long"),
          password: z
            .string({ required_error: "Password is required" })
            .min(6, "Password must be at least 6 characters long"),
          email: z
            .string({ required_error: "Email is required" })
            .email("Invalid email format"),
        }),
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              username: { type: "string", example: "john_doe" },
              password: { type: "string", example: "password123" },
              email: { type: "string", example: "john@example.com" },
            },
          },
          400: {
            description: "Bad Request",
            type: "object",
            properties: {
              error: { type: "string", example: "This email already exists" },
            },
          },
        },
        examples: {
          success: {
            summary: "Successful user creation",
            value: {
              username: "john_doe",
              password: "password123",
              email: "john@example.com",
            },
          },
          error: {
            summary: "User creation error",
            value: {
              error: "This email already exists",
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

        // Verificar se o email já existe
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

        return reply.status(201).send(user);
      },
    });
  }
}

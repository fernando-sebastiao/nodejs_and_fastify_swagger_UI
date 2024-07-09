import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { CustomError } from "../errors/CustomError";
import { db } from "../lib/db";
export class UserController {
  async createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post(
      "/user",
      {
        schema: {
          body: z.object({
            username: z
              .string()
              .min(5, "O nome precisa ter no mínimo 5 caracteres"),
            password: z.string().min(6),
            email: z.string().email({ message: "Invalid email" }),
          }),
        },
      },
      async (request, replay) => {
        const { username, password, email } = request.body as {
          username: string;
          password: string;
          email: string;
        };
        //verificar se o nome de usuário já existe

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
        return replay.status(201).send({ message: "User created", user });
      }
    );
  }
}

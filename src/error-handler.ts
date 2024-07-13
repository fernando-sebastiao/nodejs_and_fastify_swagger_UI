import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "./error/client-error";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  console.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal Server Error" });
};

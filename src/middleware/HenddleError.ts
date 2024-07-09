// import { NextFunction, Request, Response } from "express";
import { FastifyReply, FastifyRequest } from "fastify";
import { CustomError } from "../errors/CustomError";

export function errorHandler(
  err: Error,
  res: FastifyReply,
  req: FastifyRequest
) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.status(500).send({
    errors: [{ message: "Something went wrong" }],
  });
}

import { FastifyReply, FastifyRequest } from "fastify";
import { app } from "../server";

export const routes = async () => {
  app.get("/gosto", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "Hello! I'm a Fastify Backend!" };
  });
};

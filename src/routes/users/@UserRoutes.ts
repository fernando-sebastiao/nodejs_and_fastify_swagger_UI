import { FastifyInstance } from "fastify";
import { criarUser } from "./user";

export const UserRoutes = async (app: FastifyInstance) => {
  app.register(criarUser);
};

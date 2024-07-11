import { FastifyInstance } from "fastify";
import { createproject } from "../controllers/ProjectController";
import { createUser } from "../controllers/UserController";

export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(createUser);
  //rotas do project
  app.register(createproject);
};

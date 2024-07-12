import { FastifyInstance } from "fastify";
import { createproject } from "../controllers/ProjectController";
import { createUser, getallUsers } from "../controllers/UserController";

export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(createUser);
  app.register(getallUsers);
  //rotas do project
  app.register(createproject);
};

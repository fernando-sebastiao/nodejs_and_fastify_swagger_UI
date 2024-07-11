import { FastifyInstance } from "fastify";
import { ProjectControler } from "../controllers/ProjectController";
import { UserController } from "../controllers/UserController";

const usercontroller = new UserController();
const projectcontroller = new ProjectControler();
export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(usercontroller.createUser);
  //rotas do project
  app.register(projectcontroller.createproject);
};

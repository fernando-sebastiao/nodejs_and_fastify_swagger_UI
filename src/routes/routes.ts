import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/UserController";

const usercontroller = new UserController();

export const routes = async (app: FastifyInstance) => {
  app.register(usercontroller.createUser);
};

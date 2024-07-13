import { FastifyInstance } from "fastify";
import { createproject, getallProject } from "../controllers/ProjectController";
import {
  createUser,
  deleteUser,
  getallUsers,
  getUserbyId,
  updateUser,
} from "../controllers/UserController";

export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(createUser);
  app.register(getallUsers);
  app.register(getUserbyId);
  app.register(deleteUser);
  app.register(updateUser);
  //rotas do project
  app.register(createproject);
  app.register(getallProject);
};

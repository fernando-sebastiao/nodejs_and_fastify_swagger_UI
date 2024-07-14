import { FastifyInstance } from "fastify";
import {
  createproject,
  deleteProject,
  getallProject,
  getProjectbyId,
} from "../controllers/ProjectController";
import {
  createUser,
  deleteUser,
  getallUsers,
  getUserbyId,
  updateUser,
} from "../controllers/UserController";
import { createTasks, getallTasks } from "../controllers/TaskController";

export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(createUser);
  app.register(getallUsers);
  app.register(getUserbyId);
  app.register(deleteUser);
  app.register(updateUser);
  //rotas das tasks
  app.register(createTasks);
  app.register(getallTasks);
  //rotas do project
  app.register(createproject);
  app.register(getallProject);
  app.register(deleteProject);
  app.register(getProjectbyId);
};

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
  filterUser,
  getallUsers,
  getUserbyId,
  updateUser,
} from "../controllers/UserController";
import {
  createTasks,
  deleteTask,
  filterTasks,
  getallTasks,
  getTaskbyId,
  updateTasks,
} from "../controllers/TaskController";
import {
  createComment,
  deleteComment,
  filterComment,
  getAllComment,
  getCommentById,
  updateComment,
} from "../controllers/CommentController";

export const routes = async (app: FastifyInstance) => {
  //rotas do user
  app.register(createUser);
  app.register(getallUsers);
  app.register(getUserbyId);
  app.register(deleteUser);
  app.register(updateUser);
  app.register(filterUser);
  //rotas das tasks
  app.register(createTasks);
  app.register(getallTasks);
  app.register(deleteTask);
  app.register(updateTasks);
  app.register(getTaskbyId);
  app.register(filterTasks);
  //rotas do project
  app.register(createproject);
  app.register(getallProject);
  app.register(deleteProject);
  app.register(getProjectbyId);
  //rotas do comment
  app.register(createComment);
  app.register(updateComment);
  app.register(deleteComment);
  app.register(getCommentById);
  app.register(filterComment);
  app.register(getAllComment);
};

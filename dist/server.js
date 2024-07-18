"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  app: () => app
});
module.exports = __toCommonJS(server_exports);
var import_cors = __toESM(require("@fastify/cors"));
var import_swagger = __toESM(require("@fastify/swagger"));
var import_swagger_ui = __toESM(require("@fastify/swagger-ui"));
var import_fastify = __toESM(require("fastify"));
var import_fastify_type_provider_zod = require("fastify-type-provider-zod");

// src/error-handler.ts
var import_zod = require("zod");

// src/error/client-error.ts
var ClientError = class extends Error {
};

// src/error-handler.ts
var errorHandler = (error, request, reply) => {
  console.error(error);
  if (error instanceof import_zod.ZodError) {
    return reply.status(400).send({
      message: "Invalid input",
      errors: error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }))
    });
  }
  if (error instanceof ClientError) {
    return reply.status(400).send({ message: error.message });
  }
  return reply.status(500).send({ message: "Internal Server Error" });
};

// src/controllers/ProjectController.ts
var import_zod2 = __toESM(require("zod"));

// src/lib/db.ts
var import_client = require("@prisma/client");
var db = new import_client.PrismaClient({ log: ["query"] });

// src/controllers/ProjectController.ts
async function createproject(app2) {
  app2.withTypeProvider().post("/project/create", {
    schema: {
      description: "Create a new project",
      tags: ["Project"],
      body: import_zod2.default.object({
        name: import_zod2.default.string({ message: "This field must receive type string!" }).min(4, { message: "name must have 4 caracter" }),
        description: import_zod2.default.string().min(4, { message: "description must" }),
        userId: import_zod2.default.number().int().positive()
      })
    },
    handler: async (request, reply) => {
      const { name, description, userId } = request.body;
      const verificarprojecto = await db.project.findFirst({
        where: {
          name
        },
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      });
      if (verificarprojecto?.user.id === userId) {
        throw new ClientError("This project is already authenticated");
      }
      const verificarUser = await db.user.findFirst({
        where: { id: userId }
      });
      if (!verificarUser) {
        throw new ClientError("This User does not exists");
      }
      const project = await db.project.create({
        data: {
          name,
          description,
          userId
        }
      });
      return reply.status(201).send(project);
    }
  });
}
async function getallProject(app2) {
  app2.withTypeProvider().get(
    "/projects",
    {
      schema: {
        description: "Get all Project's",
        tags: ["Project"]
      }
    },
    async (req, res) => {
      const project = await db.project.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          userId: true,
          createdAt: true
        }
      });
      return res.code(200).send(project);
    }
  );
}
async function getProjectbyId(app2) {
  app2.withTypeProvider().get(
    "/project/:projectId",
    {
      schema: {
        params: import_zod2.default.object({
          projectId: import_zod2.default.string().transform((valor) => {
            const numero = Number(valor);
            if (isNaN(numero) || numero <= 0) {
              throw new ClientError(
                "Invalid type number, it must be positive integer number!"
              );
            }
            return numero;
          })
        })
      }
    },
    async (request, response) => {
      const { projectId } = request.params;
      const verificar = await db.project.findFirst({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          userId: true,
          createdAt: true
        }
      });
      if (!verificar) {
        throw new ClientError("Project not found!");
      }
      return response.code(200).send(verificar);
    }
  );
}
async function deleteProject(app2) {
  app2.withTypeProvider().delete(
    "/project/:projectId",
    {
      schema: {
        params: import_zod2.default.object({
          projectId: import_zod2.default.string().transform((valor) => {
            const numero = Number(valor);
            if (isNaN(numero) || numero <= 0) {
              throw new ClientError(
                "Invalid type number, it must be positive integer number!"
              );
            }
            return numero;
          })
        })
      }
    },
    async (request, response) => {
      const { projectId } = request.params;
      const verificar = await db.project.findFirst({
        where: { id: projectId },
        select: {
          id: true,
          name: true,
          userId: true
        }
      });
      if (!verificar) {
        throw new ClientError("Project not found!");
      }
      await db.project.delete({
        where: { id: projectId }
      });
      return response.code(200).send({
        project: {
          id: projectId,
          name: verificar.name,
          userId: verificar.userId
        }
      });
    }
  );
}

// src/controllers/UserController.ts
var import_zod3 = __toESM(require("zod"));
var import_bcrypt = __toESM(require("bcrypt"));
async function createUser(app2) {
  app2.setErrorHandler(errorHandler);
  const createUserSchema = import_zod3.default.object({
    username: import_zod3.default.string({ required_error: "Username is required" }).min(4, "The username must be at least 4 characters long"),
    password: import_zod3.default.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters long"),
    email: import_zod3.default.string({ required_error: "Email is required" }).email("Invalid email format")
  });
  app2.withTypeProvider().post("/user/create", {
    schema: {
      description: "Create a new user",
      tags: ["User"],
      body: createUserSchema
    },
    handler: async (request, reply) => {
      if (!request.body) {
        throw new ClientError("Request body cannot be empty");
      }
      const parsed = createUserSchema.safeParse(request.body);
      if (!parsed.success) {
        const errorMessages = parsed.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`).join(", ");
        throw new ClientError(`Validation failed: ${errorMessages}`);
      }
      const { username, password, email } = parsed.data;
      const verificarnome = await db.user.findFirst({ where: { username } });
      if (verificarnome) {
        throw new ClientError("This username already exists!");
      }
      const verificaremail = await db.user.findUnique({ where: { email } });
      if (verificaremail) {
        throw new ClientError("This email already exists!");
      }
      const hashPassword = await import_bcrypt.default.hash(password, 8);
      const user = await db.user.create({
        data: {
          username,
          password: hashPassword,
          email
        }
      });
      return reply.status(201).send({
        data: [{ username: user.username, email: user.email }]
      });
    }
  });
}
async function getallUsers(app2) {
  app2.withTypeProvider().get(
    "/users",
    {
      schema: {
        description: "Get all users",
        tags: ["User"]
      }
    },
    async (request, replay) => {
      const user = await db.user.findMany();
      return replay.code(200).send(user);
    }
  );
}
async function getUserbyId(app2) {
  app2.withTypeProvider().get(
    "/user/:userId",
    {
      schema: {
        params: import_zod3.default.object({
          userId: import_zod3.default.string({ message: "This field must receive number" }).transform((valor) => {
            const dados = Number(valor);
            if (isNaN(dados) || dados <= 0) {
              throw new ClientError(
                "This field must receive a positive number"
              );
            }
            return dados;
          })
        })
      }
    },
    async (request, replay) => {
      const { userId } = request.params;
      const user = await db.user.findUnique({
        where: {
          id: userId
        },
        select: {
          id: true,
          username: true,
          email: true
        }
      });
      if (!user) {
        throw new ClientError("User not found");
      }
      return replay.code(200).send(user);
    }
  );
}
async function deleteUser(app2) {
  app2.withTypeProvider().delete(
    "/user/:userId",
    {
      schema: {
        params: import_zod3.default.object({
          userId: import_zod3.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid userId");
            }
            return num;
          })
        })
      }
    },
    async (request, response) => {
      const { userId } = request.params;
      const verificar = await db.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true }
      });
      if (!verificar) {
        throw new ClientError("User not found!");
      }
      const deletedUser = await db.user.delete({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true
        }
      });
      return response.code(200).send(deletedUser);
    }
  );
}
async function updateUser(app2) {
  app2.withTypeProvider().put(
    "/user/:userId",
    {
      schema: {
        params: import_zod3.default.object({
          userId: import_zod3.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid userId");
            }
            return num;
          })
        }),
        body: import_zod3.default.object({
          username: import_zod3.default.string({
            message: "This field must receive string",
            required_error: "This field cannot be empty!"
          }),
          email: import_zod3.default.string().email(),
          password: import_zod3.default.string().min(6)
        })
      }
    },
    async (request, response) => {
      const { userId } = request.params;
      const { username, password, email } = request.body;
      const verificar = await db.user.findFirst({
        where: {
          id: userId
        }
      });
      if (!verificar) {
        throw new ClientError("User not found!");
      }
      const updatingUser = await db.user.update({
        where: {
          id: userId
        },
        data: {
          username,
          password,
          email
        }
      });
      return response.code(200).send({
        username: updatingUser.username,
        email: updatingUser.email
      });
    }
  );
}
async function filterUser(app2) {
  app2.withTypeProvider().get(
    "/user/filter",
    {
      schema: {
        querystring: import_zod3.default.object({
          username: import_zod3.default.string().optional(),
          email: import_zod3.default.string().email().optional()
        })
      }
    },
    async (request, response) => {
      const { username, email } = request.query;
      const user = await db.user.findMany({
        where: {
          username: {
            contains: username
          },
          email: {
            contains: email
          }
        }
      });
      return response.code(200).send(user);
    }
  );
}

// src/controllers/TaskController.ts
var import_zod4 = __toESM(require("zod"));
async function createTasks(app2) {
  app2.withTypeProvider().post(
    "/tasks/create",
    {
      schema: {
        body: import_zod4.default.object({
          title: import_zod4.default.string(),
          description: import_zod4.default.string().optional(),
          status: import_zod4.default.enum(["pending", "in-progress", "completed"], {
            message: "Status must be pending, in-progress, or completed"
          }).default("pending"),
          projectId: import_zod4.default.number(),
          userId: import_zod4.default.number()
        })
      }
    },
    async (request, replay) => {
      const { title, description, status, projectId, userId } = request.body;
      const verifyProject = await db.project.findFirst({
        where: { id: projectId }
      });
      if (!verifyProject) {
        throw new ClientError("This projectId does not exist");
      }
      const verifyUser = await db.user.findFirst({
        where: { id: userId }
      });
      if (!verifyUser) {
        throw new ClientError("This User does not exist");
      }
      const task = await db.task.create({
        data: {
          title,
          description,
          projectId,
          userId,
          status
        }
      });
      return replay.code(201).send({ message: "User created successfully", task });
    }
  );
}
async function getallTasks(app2) {
  app2.withTypeProvider().get(
    "/tasks",
    {
      schema: {
        description: "Get all Tasks",
        tags: ["Task"]
      }
    },
    async (req, res) => {
      const task = await db.task.findMany({
        orderBy: {
          id: "asc"
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      return res.code(200).send(task);
    }
  );
}
async function deleteTask(app2) {
  app2.withTypeProvider().delete(
    "/tasks/delete/:id",
    {
      schema: {
        params: import_zod4.default.object({
          id: import_zod4.default.number()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.delete({
        where: {
          id
        }
      });
      return res.code(200).send({ message: "Task deleted successfully", task });
    }
  );
}
async function getTaskbyId(app2) {
  app2.withTypeProvider().get(
    "/tasks/:id",
    {
      schema: {
        params: import_zod4.default.object({
          id: import_zod4.default.number()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const task = await db.task.findUnique({
        where: {
          id
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      return res.code(200).send(task);
    }
  );
}
async function updateTasks(app2) {
  app2.withTypeProvider().put(
    "/tasks/update/:id",
    {
      schema: {
        params: import_zod4.default.object({
          id: import_zod4.default.number()
        }),
        body: import_zod4.default.object({
          title: import_zod4.default.string().optional(),
          description: import_zod4.default.string().optional(),
          status: import_zod4.default.enum(["pending", "in-progress", "completed"], {
            message: "Status must be pending, in-progress, or completed"
          }).optional(),
          projectId: import_zod4.default.number().optional(),
          userId: import_zod4.default.number().optional()
        })
      }
    },
    async (req, res) => {
      const { id } = req.params;
      const { title, description, status, projectId, userId } = req.body;
      const task = await db.task.findUnique({
        where: {
          id
        }
      });
      if (!task) {
        throw new ClientError("Task not found");
      }
      const updateTask = await db.task.update({
        where: {
          id
        },
        data: {
          title: title || task.title,
          description: description || task.description,
          status: status || task.status,
          projectId: projectId || task.projectId,
          userId: userId || task.userId
        }
      });
      return res.code(200).send({ message: "Task updated successfully", updateTask });
    }
  );
}
async function filterTasks(app2) {
  app2.withTypeProvider().get(
    "/tasks/filter",
    {
      schema: {
        querystring: import_zod4.default.object({
          status: import_zod4.default.string().optional(),
          projectId: import_zod4.default.number().optional(),
          userId: import_zod4.default.number().optional()
        })
      }
    },
    async (req, res) => {
      const { status, projectId, userId } = req.query;
      const task = await db.task.findMany({
        where: {
          status,
          projectId,
          userId
        },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          user: {
            select: {
              id: true,
              username: true
            }
          },
          projectId: true
        }
      });
      return res.code(200).send(task);
    }
  );
}

// src/controllers/CommentController.ts
var import_zod5 = __toESM(require("zod"));
async function createComment(app2) {
  app2.withTypeProvider().post(
    "/comment",
    {
      schema: {
        body: import_zod5.default.object({
          content: import_zod5.default.string(),
          taskId: import_zod5.default.number({ message: "This field must be a number!" }).int({ message: "This field must be integer" }).positive({ message: "This field must be positive" }),
          userId: import_zod5.default.number()
        })
      }
    },
    async (request, replay) => {
      const { content, taskId, userId } = request.body;
      const verifyTask = await db.task.findFirst({
        where: { id: taskId }
      });
      if (!verifyTask) {
        throw new ClientError("This taskId does not exist");
      }
      const verifyUser = await db.user.findFirst({
        where: { id: userId }
      });
      if (!verifyUser) {
        throw new ClientError("This User does not exist");
      }
      const comment = await db.comment.create({
        data: {
          content,
          taskId,
          userId
        }
      });
      return replay.code(201).send({ message: "Comment created successfully", comment });
    }
  );
}
async function updateComment(app2) {
  app2.withTypeProvider().put(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod5.default.object({
          commentId: import_zod5.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          })
        }),
        body: import_zod5.default.object({
          content: import_zod5.default.string()
        })
      }
    },
    async (request, response) => {
      const { commentId } = request.params;
      const { content } = request.body;
      const verifyComment = await db.comment.findFirst({
        where: {
          id: commentId
        }
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }
      const updatingComment = await db.comment.update({
        where: {
          id: commentId
        },
        data: {
          content
        }
      });
      return response.code(200).send({
        content: updatingComment.content
      });
    }
  );
}
async function deleteComment(app2) {
  app2.withTypeProvider().delete(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod5.default.object({
          commentId: import_zod5.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          })
        })
      }
    },
    async (request, response) => {
      const { commentId } = request.params;
      const verifyComment = await db.comment.findFirst({
        where: { id: commentId }
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }
      await db.comment.delete({
        where: { id: commentId }
      });
      return response.code(200).send({
        comment: {
          id: commentId,
          content: verifyComment.content
        }
      });
    }
  );
}
async function getCommentById(app2) {
  app2.withTypeProvider().get(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod5.default.object({
          commentId: import_zod5.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          })
        })
      }
    },
    async (request, response) => {
      const { commentId } = request.params;
      const verifyComment = await db.comment.findFirst({
        where: { id: commentId }
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }
      return response.code(200).send(verifyComment);
    }
  );
}
async function filterComment(app2) {
  app2.withTypeProvider().get(
    "/comment/filter",
    {
      schema: {
        querystring: import_zod5.default.object({
          taskId: import_zod5.default.number().optional(),
          userId: import_zod5.default.number().optional()
        })
      }
    },
    async (request, response) => {
      const { taskId, userId } = request.query;
      const comment = await db.comment.findMany({
        where: {
          taskId,
          userId
        }
      });
      return response.code(200).send(comment);
    }
  );
}
async function getAllComment(app2) {
  app2.withTypeProvider().get("/comment", async (request, response) => {
    const comment = await db.comment.findMany();
    return response.code(200).send(comment);
  });
}

// src/routes/routes.ts
var routes = async (app2) => {
  app2.register(createUser);
  app2.register(getallUsers);
  app2.register(getUserbyId);
  app2.register(deleteUser);
  app2.register(updateUser);
  app2.register(filterUser);
  app2.register(createTasks);
  app2.register(getallTasks);
  app2.register(deleteTask);
  app2.register(updateTasks);
  app2.register(getTaskbyId);
  app2.register(filterTasks);
  app2.register(createproject);
  app2.register(getallProject);
  app2.register(deleteProject);
  app2.register(getProjectbyId);
  app2.register(createComment);
  app2.register(updateComment);
  app2.register(deleteComment);
  app2.register(getCommentById);
  app2.register(filterComment);
  app2.register(getAllComment);
};

// src/server.ts
var app = (0, import_fastify.default)();
app.register(import_cors.default, { origin: "*" });
app.setValidatorCompiler(import_fastify_type_provider_zod.validatorCompiler);
app.setSerializerCompiler(import_fastify_type_provider_zod.serializerCompiler);
app.setErrorHandler(errorHandler);
app.register(import_swagger.default, {
  openapi: {
    info: {
      title: "RH Module",
      description: "Fastify backed-end module for Tecno Bantu.",
      version: "1.0.0"
    },
    servers: [
      {
        url: "http://localhost:8800"
      }
    ]
  }
});
app.register(import_swagger_ui.default, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "none",
    // Pode ser 'none', 'list' ou 'full'
    deepLinking: true,
    displayOperationId: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    defaultModelRendering: "example",
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true
  }
});
app.get("/", async (request, reply) => {
  return { message: "Server running correctly" };
});
app.route({
  method: "GET",
  url: "/hello/:name",
  handler: async (request, reply) => {
    const { name } = request.params;
    return { message: `Hello! ${name}, I hope you're doing well!` };
  }
});
app.register(routes);
var start = async () => {
  try {
    await app.listen({ port: 8800 });
    app.log.info(`Server running on http://localhost:8800`);
    console.log("Server running on PORT: 8800");
  } catch (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
};
start();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});

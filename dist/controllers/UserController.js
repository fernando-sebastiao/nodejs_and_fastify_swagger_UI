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

// src/controllers/UserController.ts
var UserController_exports = {};
__export(UserController_exports, {
  createUser: () => createUser,
  deleteUser: () => deleteUser,
  filterUser: () => filterUser,
  getUserbyId: () => getUserbyId,
  getallUsers: () => getallUsers,
  updateUser: () => updateUser
});
module.exports = __toCommonJS(UserController_exports);
var import_zod2 = __toESM(require("zod"));

// src/error/client-error.ts
var ClientError = class extends Error {
};

// src/lib/db.ts
var import_client = require("@prisma/client");
var db = new import_client.PrismaClient({ log: ["query"] });

// src/controllers/UserController.ts
var import_bcrypt = __toESM(require("bcrypt"));

// src/error-handler.ts
var import_zod = require("zod");
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

// src/controllers/UserController.ts
async function createUser(app) {
  app.setErrorHandler(errorHandler);
  const createUserSchema = import_zod2.default.object({
    username: import_zod2.default.string({ required_error: "Username is required" }).min(4, "The username must be at least 4 characters long"),
    password: import_zod2.default.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters long"),
    email: import_zod2.default.string({ required_error: "Email is required" }).email("Invalid email format")
  });
  app.withTypeProvider().post("/user/create", {
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
async function getallUsers(app) {
  app.withTypeProvider().get(
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
async function getUserbyId(app) {
  app.withTypeProvider().get(
    "/user/:userId",
    {
      schema: {
        params: import_zod2.default.object({
          userId: import_zod2.default.string({ message: "This field must receive number" }).transform((valor) => {
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
async function deleteUser(app) {
  app.withTypeProvider().delete(
    "/user/:userId",
    {
      schema: {
        params: import_zod2.default.object({
          userId: import_zod2.default.string().transform((val) => {
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
async function updateUser(app) {
  app.withTypeProvider().put(
    "/user/:userId",
    {
      schema: {
        params: import_zod2.default.object({
          userId: import_zod2.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid userId");
            }
            return num;
          })
        }),
        body: import_zod2.default.object({
          username: import_zod2.default.string({
            message: "This field must receive string",
            required_error: "This field cannot be empty!"
          }),
          email: import_zod2.default.string().email(),
          password: import_zod2.default.string().min(6)
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
async function filterUser(app) {
  app.withTypeProvider().get(
    "/user/filter",
    {
      schema: {
        querystring: import_zod2.default.object({
          username: import_zod2.default.string().optional(),
          email: import_zod2.default.string().email().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUser,
  deleteUser,
  filterUser,
  getUserbyId,
  getallUsers,
  updateUser
});

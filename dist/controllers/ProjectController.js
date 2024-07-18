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

// src/controllers/ProjectController.ts
var ProjectController_exports = {};
__export(ProjectController_exports, {
  createproject: () => createproject,
  deleteProject: () => deleteProject,
  getProjectbyId: () => getProjectbyId,
  getallProject: () => getallProject
});
module.exports = __toCommonJS(ProjectController_exports);
var import_zod = __toESM(require("zod"));

// src/error/client-error.ts
var ClientError = class extends Error {
};

// src/lib/db.ts
var import_client = require("@prisma/client");
var db = new import_client.PrismaClient({ log: ["query"] });

// src/controllers/ProjectController.ts
async function createproject(app) {
  app.withTypeProvider().post("/project/create", {
    schema: {
      description: "Create a new project",
      tags: ["Project"],
      body: import_zod.default.object({
        name: import_zod.default.string({ message: "This field must receive type string!" }).min(4, { message: "name must have 4 caracter" }),
        description: import_zod.default.string().min(4, { message: "description must" }),
        userId: import_zod.default.number().int().positive()
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
async function getallProject(app) {
  app.withTypeProvider().get(
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
async function getProjectbyId(app) {
  app.withTypeProvider().get(
    "/project/:projectId",
    {
      schema: {
        params: import_zod.default.object({
          projectId: import_zod.default.string().transform((valor) => {
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
async function deleteProject(app) {
  app.withTypeProvider().delete(
    "/project/:projectId",
    {
      schema: {
        params: import_zod.default.object({
          projectId: import_zod.default.string().transform((valor) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createproject,
  deleteProject,
  getProjectbyId,
  getallProject
});

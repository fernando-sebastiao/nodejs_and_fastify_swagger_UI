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

// src/controllers/CommentController.ts
var CommentController_exports = {};
__export(CommentController_exports, {
  createComment: () => createComment,
  deleteComment: () => deleteComment,
  filterComment: () => filterComment,
  getAllComment: () => getAllComment,
  getCommentById: () => getCommentById,
  updateComment: () => updateComment
});
module.exports = __toCommonJS(CommentController_exports);

// src/error/client-error.ts
var ClientError = class extends Error {
};

// src/controllers/CommentController.ts
var import_zod = __toESM(require("zod"));

// src/lib/db.ts
var import_client = require("@prisma/client");
var db = new import_client.PrismaClient({ log: ["query"] });

// src/controllers/CommentController.ts
async function createComment(app) {
  app.withTypeProvider().post(
    "/comment",
    {
      schema: {
        body: import_zod.default.object({
          content: import_zod.default.string(),
          taskId: import_zod.default.number({ message: "This field must be a number!" }).int({ message: "This field must be integer" }).positive({ message: "This field must be positive" }),
          userId: import_zod.default.number()
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
async function updateComment(app) {
  app.withTypeProvider().put(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod.default.object({
          commentId: import_zod.default.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          })
        }),
        body: import_zod.default.object({
          content: import_zod.default.string()
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
async function deleteComment(app) {
  app.withTypeProvider().delete(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod.default.object({
          commentId: import_zod.default.string().transform((val) => {
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
async function getCommentById(app) {
  app.withTypeProvider().get(
    "/comment/:commentId",
    {
      schema: {
        params: import_zod.default.object({
          commentId: import_zod.default.string().transform((val) => {
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
async function filterComment(app) {
  app.withTypeProvider().get(
    "/comment/filter",
    {
      schema: {
        querystring: import_zod.default.object({
          taskId: import_zod.default.number().optional(),
          userId: import_zod.default.number().optional()
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
async function getAllComment(app) {
  app.withTypeProvider().get("/comment", async (request, response) => {
    const comment = await db.comment.findMany();
    return response.code(200).send(comment);
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createComment,
  deleteComment,
  filterComment,
  getAllComment,
  getCommentById,
  updateComment
});

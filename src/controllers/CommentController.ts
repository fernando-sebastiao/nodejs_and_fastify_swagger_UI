//create Comment

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { ClientError } from "../error/client-error";
import z from "zod";
import { db } from "../lib/db";

export async function createComment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/comment",
    {
      schema: {
        body: z.object({
          content: z.string(),
          taskId: z
            .number({ message: "This field must be a number!" })
            .int({ message: "This field must be integer" })
            .positive({ message: "This field must be positive" }),
          userId: z.number(),
        }),
      },
    },
    async (request, replay) => {
      const { content, taskId, userId } = request.body;

      //verificar task
      const verifyTask = await db.task.findFirst({
        where: { id: taskId },
      });
      if (!verifyTask) {
        throw new ClientError("This taskId does not exist");
      }
      //verificar user
      const verifyUser = await db.user.findFirst({
        where: { id: userId },
      });
      if (!verifyUser) {
        throw new ClientError("This User does not exist");
      }
      const comment = await db.comment.create({
        data: {
          content,
          taskId,
          userId,
        },
      });
      return replay
        .code(201)
        .send({ message: "Comment created successfully", comment });
    }
  );
}

//update Comment
export async function updateComment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/comment/:commentId",
    {
      schema: {
        params: z.object({
          commentId: z.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          }),
        }),
        body: z.object({
          content: z.string(),
        }),
      },
    },
    async (request, response) => {
      const { commentId } = request.params;
      const { content } = request.body;

      //verificar se o commentId existe
      const verifyComment = await db.comment.findFirst({
        where: {
          id: commentId,
        },
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }
      const updatingComment = await db.comment.update({
        where: {
          id: commentId,
        },
        data: {
          content,
        },
      });
      return response.code(200).send({
        content: updatingComment.content,
      });
    }
  );
}
//delete Comment
export async function deleteComment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/comment/:commentId",
    {
      schema: {
        params: z.object({
          commentId: z.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          }),
        }),
      },
    },
    async (request, response) => {
      const { commentId } = request.params;

      //verificar se o commentId existe
      const verifyComment = await db.comment.findFirst({
        where: { id: commentId },
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }

      await db.comment.delete({
        where: { id: commentId },
      });

      return response.code(200).send({
        comment: {
          id: commentId,
          content: verifyComment.content,
        },
      });
    }
  );
}

//get Comment by Id
export async function getCommentById(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/comment/:commentId",
    {
      schema: {
        params: z.object({
          commentId: z.string().transform((val) => {
            const num = Number(val);
            if (isNaN(num) || num <= 0) {
              throw new Error("Invalid commentId");
            }
            return num;
          }),
        }),
      },
    },
    async (request, response) => {
      const { commentId } = request.params as { commentId: number };

      //verificar se o commentId existe
      const verifyComment = await db.comment.findFirst({
        where: { id: commentId },
      });
      if (!verifyComment) {
        throw new ClientError("Comment not found!");
      }

      return response.code(200).send(verifyComment);
    }
  );
}
//filter Comment by query string by taskId, userId
export async function filterComment(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/comment/filter",
    {
      schema: {
        querystring: z.object({
          taskId: z.number().optional(),
          userId: z.number().optional(),
        }),
      },
    },
    async (request, response) => {
      const { taskId, userId } = request.query as {
        taskId?: number;
        userId?: number;
      };

      const comment = await db.comment.findMany({
        where: {
          taskId,
          userId,
        },
      });
      return response.code(200).send(comment);
    }
  );
}
//getall Comment
export async function getAllComment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/comment", async (request, response) => {
      const comment = await db.comment.findMany();
      return response.code(200).send(comment);
    });
}

import { main } from "../../prisma/seed";
import { db } from "../database/db";

const checkDatabase = async function () {
  const UserCount = await db.user.count();
  const CommentCount = await db.comment.count();
  const ProjectCount = await db.project.count();
  const TaskCount = await db.task.count();
  if (
    UserCount === 0 ||
    CommentCount === 0 ||
    ProjectCount === 0 ||
    TaskCount === 0
  ) {
    await main();
  }
};

export default checkDatabase;

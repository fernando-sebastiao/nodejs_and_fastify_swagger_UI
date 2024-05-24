import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export const criarUser = async (app: FastifyInstance) => {
  const usuarios = [
    {
      id: 6,
      name: "Domingos Manuel",
    },
  ];
  app.get("/create-user", async (req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send(usuarios);
  });
};

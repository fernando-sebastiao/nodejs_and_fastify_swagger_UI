import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { casa } from "../../types/global";

export const criarUser = async (app: FastifyInstance) => {
  const dados: casa = {
    familia: [
      {
        id: 12,
        name: "Fernando Afonso Sebastião",
        nascimento: new Date("2012-04-20"),
      },
      {
        id: 15,
        name: "Divado Hélder Namboge",
        nascimento: new Date("2015-05-30"),
      },
    ],
  };

  app.get("/user", async (req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send(dados);
  });
};

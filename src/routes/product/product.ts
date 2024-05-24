import { FastifyInstance } from "fastify";
import { pessoas } from "../../types/global";

export const criarProduto = async (app: FastifyInstance) => {
 

const dados: pessoas = {
  id: 12,
  name: "Fernando Afonso Sebastião",
  nascimento: new Date("2012-04-20")
}

  app.get("/produtos", async (req, rep) => {
    return rep.status(200).send(dados);
  });
};

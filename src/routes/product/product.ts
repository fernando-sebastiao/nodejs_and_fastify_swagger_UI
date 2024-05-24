import { FastifyInstance } from "fastify";
import { store } from "../../types/global";

export const criarProduto = async (app: FastifyInstance) => {
  const produtos: store = {
    Banca: [
      {
        id: 44,
        produto: "Garoto",
        price: 124.12,
      },
    ],
  };

  app.get("/produtos", async (req, rep) => {
    return rep.status(200).send(produtos);
  });
};

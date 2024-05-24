import { FastifyInstance } from "fastify";

export const criarProduto = async (app: FastifyInstance) => {
  const pessoas = [
    {
      id: 1,
      name: "Divaldo Hélder",
    },
    {
      id: 2,
      name: "Edivaldo Pinheiro António",
    },
  ];
  app.get("/produtos", async (req, rep) => {
    return rep.status(200).send(pessoas);
  });
};

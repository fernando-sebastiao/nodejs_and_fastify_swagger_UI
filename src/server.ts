import cors from "@fastify/cors";
import fastify, { FastifyInstance } from "fastify";
import { routes } from "./routes/routes";

export const app: FastifyInstance = fastify();

app.register(routes);

app.register(cors, {});

app.get("/", async (req, rep) => {
  rep.send({ message: "Everthing is gonna well!" });
});

app.listen({ port: 8800 }, (err, address) => {
  if (err) {
    console.log(err);
  }
  console.log(`🔥 Servidor rodando na porta ${address}`);
});

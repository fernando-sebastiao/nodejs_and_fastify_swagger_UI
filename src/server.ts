import fastify from "fastify";

export const app = fastify();

app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.log(err);
  }
  console.log("Servidor rodando na porta 8000");
});

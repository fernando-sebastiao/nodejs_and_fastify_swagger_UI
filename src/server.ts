import cors from "@fastify/cors";
import fastify from "fastify";

const server = fastify({ logger: true });

server.register(cors, { origin: "*" });

server.route({
  method: "GET",
  url: "/hello/:name",
  handler: async (request, reply) => {
    const { name } = request.params as { name: string };
    return {
      message: `Hello! ${name}, espero que esteja tudo bem!`,
    };
  },
});
const start = async () => {
  try {
    await server.listen({ port: 8800 });
    server.log.info(`Servidor rodando em http://localhost:8800`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

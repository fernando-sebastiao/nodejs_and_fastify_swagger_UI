import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastify from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

const server = fastify({ logger: true });

server.register(cors, { origin: "*" });
server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "RH Module",
      description: "Fastify backed-end module for Tecno Bantu.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
server.register(import("@fastify/swagger-ui"), {
  routePrefix: "/docs",
});

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

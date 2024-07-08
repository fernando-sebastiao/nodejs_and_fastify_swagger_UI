import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify, { FastifyInstance } from "fastify";
import checkDatabase from "./middleware/checkdatabase";
import { routes } from "./routes/routes";

export const app: FastifyInstance = fastify({ logger: true });

app.register(routes);

app.register(cors, { origin: "*" });

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "RH Module",
      description: "Fastify backed-end module for Tecno Bantu.",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8800",
      },
    ],
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "none", // Pode ser 'none', 'list' ou 'full'
    deepLinking: true,
    displayOperationId: true,
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    defaultModelRendering: "example",
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
});

app.get("/", async (request, reply) => {
  return { message: "Server running correctly" };
});

app.route({
  method: "GET",
  url: "/hello/:name",
  handler: async (request, reply) => {
    const { name } = request.params as { name: string };
    return {
      message: `Hello! ${name}, I hope you're doing well!`,
    };
  },
});

const start = async () => {
  try {
    await app.listen({ port: 8800 });
    app.log.info(`Server running on http://localhost:8800`);
  } catch (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();
app.register(checkDatabase);

import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { routes } from "./routes/routes";

export const app = fastify();

// Registre o plugin de CORS
app.register(cors, { origin: "*" });

// Configure o compilador de validadores e serializadores
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler);

// Registre o plugin do Swagger
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

// Registre o plugin do Swagger UI
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

// Defina uma rota simples de teste
app.get("/", async (request, reply) => {
  return { message: "Server running correctly" };
});

// Defina uma rota de exemplo
app.route({
  method: "GET",
  url: "/hello/:name",
  handler: async (request, reply) => {
    const { name } = request.params as { name: string };
    return { message: `Hello! ${name}, I hope you're doing well!` };
  },
});

// Registre as rotas importadas
app.register(routes);

// Defina o manipulador de erros
app.setErrorHandler(errorHandler);

// Inicie o servidor
const start = async () => {
  try {
    await app.listen({ port: 8800 });
    app.log.info(`Server running on http://localhost:8800`);
    console.log("Server running on PORT: 8800");
  } catch (err) {
    app.log.error(err);
    console.log(err);
    process.exit(1);
  }
};

start();

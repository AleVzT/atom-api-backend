import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Tareas",
      version: "1.0.0",
      description: "Documentación de la API de Tareas con Swagger",
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
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/interfaces/http/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: Express) {

  app.get("/docs/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Montamos la UI de Swagger
  app.use(
    "/docs",
    swaggerUi.serveFiles(swaggerSpec),
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "API de Tareas",
      swaggerUrl: "./docs/swagger.json",
    })
  );
}


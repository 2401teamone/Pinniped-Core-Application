import express from "express";
import cors from "cors";
import generateCrudRouter from "./crud.js";
import generateCustomRouter from "./custom.js";
import generateSchemaRouter from "./schema.js";
import generateUIRouter from "./ui.js";
import errorHandler from "./middleware/error_handler.js";

function initApi(app) {
  const server = express();
  server.use(express.json());
  server.use(cors());

  // server.use(logger)
  // server.use(rateLimiter)

  const crudRouter = generateCrudRouter(app);
  // const authRouter = bindAuthApi(app);
  const schemaRouter = generateSchemaRouter(app);
  const customRouter = generateCustomRouter(app);
  const UIRouter = generateUIRouter(app);

  server.use("/api", crudRouter);
  // server.use("/api", authRouter);
  server.use("/api/schema", schemaRouter);
  server.use("/", customRouter);
  server.use("/ui", UIRouter);

  //Catch All Error Handler
  server.use(errorHandler);

  return server;
}

export default initApi;

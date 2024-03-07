import express from "express";
import cors from "cors";

import generateCrudRouter from "./crud.js";
import generateCustomRouter from "./custom.js";
import generateSchemaRouter from "./schema.js";
import generateUIRouter from "./ui.js";
import generateAuthRouter from "./auth.js";

import errorHandler from "./middleware/error_handler.js";

import session from "express-session";
import store from "better-sqlite3-session-store";
import sqlite from "better-sqlite3";

const SqliteStore = store(session);
const db = new sqlite("session.db", { verbose: console.log });

function initApi(app) {
  const server = express();
  server.use(express.json());
  server.use(cors());

  server.use(
    session({
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000, //ms = 15min
        },
      }),
      secret: "elephant seal",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
      // cookie: { maxAge: 30 * 1000 }, // 30 seconds
      // enable below property when in production and using HTTPS or set up auto config through ENV
      // cookie: { secure: true }
    })
  );

  // server.use(logger)
  // server.use(rateLimiter)

  const authRouter = generateAuthRouter(app);
  const crudRouter = generateCrudRouter(app);
  const schemaRouter = generateSchemaRouter(app);
  const customRouter = generateCustomRouter(app);
  const UIRouter = generateUIRouter(app);

  server.use("/api/auth", authRouter);
  server.use("/api", crudRouter);
  server.use("/api/schema", schemaRouter);
  server.use("/", customRouter);
  server.use("/ui", UIRouter);

  server.get("*", (req, res, next) => {
    res.send("Page does not exist");
  });

  //Catch All Error Handler
  server.use(errorHandler);

  return server;
}

export default initApi;

import express from "express";
import dotenv from "dotenv";
dotenv.config();

//Routers
import generateCrudRouter from "./crud.js";
import generateCustomRouter from "./custom.js";
import generateSchemaRouter from "./schema.js";
import generateUIRouter from "./ui.js";
import generateAuthRouter from "./auth.js";

//Middleware
import errorHandler from "./middleware/error_handler.js";
import sanitize from "./middleware/sanitize.js";
import setHeaders from "./middleware/set_headers.js";
import cors from "cors";

//Session
import session from "express-session";
import store from "better-sqlite3-session-store";
import sqlite from "better-sqlite3";

const SqliteStore = store(session);
const db = new sqlite("session.db");
// const db = new sqlite("session.db", { verbose: console.log });

function initApi(app) {
  const server = express();
  server.use(express.json());
  server.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  server.use(
    session({
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000, //ms = 15min
        },
      }),
      secret: process.env.SESSION_SECRET || "secret",
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        // httpOnly: true, //prevent client side JS from reading the cookie
        secure: false, //set to true when using HTTPS in production
        sameSite: "none", // allows cross origin cookies UPDATE BASED ON CONFIG / DEPLOYEMENT
      },
    })
  );

  server.use(sanitize());
  server.use(setHeaders());

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

  // Catch All Error Handler
  server.use(errorHandler);

  return server;
}

export default initApi;

import express from "express";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

//Routers
import generateCrudRouter from "./crud.js";
import generateCustomRouter from "./custom.js";
import generateSchemaRouter from "./schema.js";
import generateUIRouter from "./ui.js";
import generateAuthRouter from "./auth.js";
import generateAdminRouter from "./admin.js";

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
if (!fs.existsSync("pnpd_data")) fs.mkdirSync("pnpd_data");
const db = new sqlite("pnpd_data/session.db");

function initApi(app) {
  const server = express();

  server.use("/_", express.static("ui"));
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
        httpOnly: true, //prevent client side JS from reading the cookie
        secure: false, //set to true when using HTTPS in production
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
  const adminRouter = generateAdminRouter(app);
  const customRouter = generateCustomRouter(app);

  server.use("/api/auth", authRouter);
  server.use("/api", crudRouter);
  server.use("/api/schema", schemaRouter);
  server.use("/admin", adminRouter);
  server.use("/", customRouter);

  server.get("*", (req, res, next) => {
    res.send("Page does not exist");
  });

  // Catch All Error Handler
  server.use(errorHandler);

  return server;
}

export default initApi;

import { Router } from "express";
import catchError from "../utils/catch_error.js";
import Database from "better-sqlite3";
import adminOnly from "./middleware/admin_only.js";

export default function generateAdminRouter(app) {
  const router = Router();
  const adminAPI = new AdminAPI(app);

  // router.use(adminOnly());
  router.get("/export", catchError(adminAPI.exportHandler()));
  router.post("/import", catchError(adminAPI.importHandler()));

  return router;
}

class AdminAPI {
  constructor(app) {
    this.app = app;
    this.db = this.openConnection();
  }

  openConnection() {
    // assures that the better-sqlite3 connection will connect to the app database
    let dbName = this.app.getDAO().getDB().client.connectionSettings.filename;
    // creates new better-sqlite3 connection
    return new Database(dbName);
  }
  exportHandler() {
    return async (req, res, next) => {
      console.log("backing up the db...");
      res.sendStatus(200);
    };
  }

  importHandler() {
    return async (req, res, next) => {
      console.log("replacing your database with target database...");
      res.sendStatus(201);
    };
  }
}

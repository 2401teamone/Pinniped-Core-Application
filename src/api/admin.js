import { Router } from "express";
import catchError from "../utils/catch_error.js";
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
  }

  exportHandler() {
    return async (req, res, next) => {
      let connection = this.app.getDAO().sqlite3Connection;
      let dbName = connection.name;
      let newName = `backup_${Date.now()}_${dbName}`;
      console.log(`Backing up ${dbName} as '${newName}'...`);

      await this.app.getDAO().sqlite3Connection.backup(newName);
      console.log("Backup Complete!");
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

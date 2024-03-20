import { Router } from "express";
import catchError from "../../utils/catch_error.js";
import adminOnly from "../middleware/admin_only.js";

export default function generateAdminRouter(app) {
  const router = Router();
  const adminAPI = new AdminAPI(app);

  // router.use(adminOnly());
  router.get("/backup", catchError(adminAPI.backupHandler()));

  return router;
}

class AdminAPI {
  constructor(app) {
    this.app = app;
  }

  backupHandler() {
    return async (req, res, next) => {
      await this.app.getDAO().dbBackup();
      res.sendStatus(200);
    };
  }
}



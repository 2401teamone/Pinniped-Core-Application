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
      let filePath = await this.app.getDAO().dbBackup();
      this.app.onBackupDatabase().trigger({ req, res, filePath });
      res.sendStatus(200);
    };
  }
}

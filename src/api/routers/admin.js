import { Router } from "express";
import catchError from "../../utils/catch_error.js";
import ResponseData from "../../models/response_data.js";
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

      const responseData = new ResponseData(req, res, { filePath });

      this.app.onBackupDatabase().trigger(responseData);

      if (responseData.responseSent()) return null;

      res.status(200).json(responseData.formatGeneralResponse());
    };
  }
}

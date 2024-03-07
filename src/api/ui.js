import { Router } from "express";
import catchError from "../utils/catch_error.js";

export default function generateUIRouter(app) {
  const router = Router();

  router.get(
    "/",
    catchError(async (req, res, next) => {
      const allTableMeta = await app.getDAO().getAll("tablemeta");
      let html = "<div>";
      allTableMeta.forEach((table) => {
        html += `<div>${table.name}</div>`;
      });
      html += "</div>";
      res.send(html);
    })
  );

  return router;
}

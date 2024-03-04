import { Router } from "express";
import loadTableContext from "./middleware/load_table_context.js";

const BASE = "/tables/:table";

export default function bindCrudApi(app) {
  const router = Router();
  const crudApi = new CrudApi(app);

  router.get("/tables/:table", loadTableContext(app), crudApi.getAll());
  router.get("/tables/:table/:id", loadTableContext(app), crudApi.getOne());

  return router;
}

class CrudApi {
  constructor(app) {
    this.app = app;
  }

  // getAll route
  getAll() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const rows = await this.app.getDAO().getAll(table);
      console.log("hey world");
      res.json({ rows });
    };
  }

  // getOne route
  getOne() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { id } = req.params;
      const row = await this.app.getDAO().getOne(table, id);
      console.log("hey world");
      res.json({ row });
    };
  }

  // createOne route
  // updateOne route
  // deleteOne route
}

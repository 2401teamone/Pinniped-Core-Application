import { Router } from "express";
import loadTableContext from "./middleware/load_table_context.js";

const BASE = "/tables/:table";

export default function bindCrudApi(app) {
  const router = Router();
  const crudApi = new CrudApi(app);

  router.get("/tables/:table", loadTableContext(app), crudApi.getAll());
  router.get("/tables/:table/:id", loadTableContext(app), crudApi.getOne());
  router.patch(
    "/tables/:table/:id",
    loadTableContext(app),
    crudApi.updateOne()
  );
  router.post("/tables/:table", loadTableContext(app), crudApi.createOne());
  router.delete(
    "/tables/:table/:id",
    loadTableContext(app),
    crudApi.deleteOne()
  );

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
      res.status(200).json({ rows });
    };
  }

  // getOne route
  getOne() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { id } = req.params;
      const row = await this.app.getDAO().getOne(table, id);
      console.log("hey world");
      res.status(200).json({ row });
    };
  }

  // createOne route
  createOne() {
    return async (req, res, next) => {
      //validate the schema and here before creating ???
      const { table } = res.locals;
      const createdRow = await this.app.getDAO().createOne(table, req.body);
      console.log("hey world");
      res.status(201).json({ createdRow });
    };
  }

  // updateOne route
  updateOne() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { id } = req.params;
      const updatedRow = await this.app.getDAO().updateOne(table, id, req.body);
      res.status(200).json({ updatedRow });
    };
  }

  // deleteOne route
  deleteOne() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { id } = req.params;
      await this.app.getDAO().deleteOne(table, id);
      res.status(204).json({ message: "Row Successfully Deleted" });
    };
  }
}

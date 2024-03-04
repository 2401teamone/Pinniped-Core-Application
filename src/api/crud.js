import { Router } from "express";
import loadTableContext from "./middleware/load_table_context.js";
import catchError from "../utils/catch_error.js";
import { BadRequestError } from "../utils/errors.js";

const BASE = "/tables/:table";

export default function bindCrudApi(app) {
  const router = Router();
  const crudApi = new CrudApi(app);

  router.get(BASE, loadTableContext(app), catchError(crudApi.getAll()));
  router.get(
    `${BASE}/:id`,
    loadTableContext(app),
    catchError(crudApi.getOne())
  );
  router.post(BASE, loadTableContext(app), catchError(crudApi.createOne()));
  router.patch(
    `${BASE}/:id`,
    loadTableContext(app),
    catchError(crudApi.updateOne())
  );
  router.delete(
    `${BASE}/:id`,
    loadTableContext(app),
    catchError(crudApi.deleteOne())
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
      res.status(200).json({ rows });
    };
  }

  // getOne route
  getOne() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { id } = req.params;
      const row = await this.app.getDAO().getOne(table, id);
      if (!row.length) throw new BadRequestError();
      res.status(200).json({ row });
    };
  }

  // createOne route
  createOne() {
    return async (req, res, next) => {
      //validate the schema and here before creating ???
      const { table } = res.locals;
      const createdRow = await this.app.getDAO().createOne(table, req.body);
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
      res.status(204);
    };
  }
}

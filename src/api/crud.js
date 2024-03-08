import { Router } from "express";
import loadTableContext from "./middleware/load_table_context.js";
import catchError from "../utils/catch_error.js";
import { BadRequestError, ForbiddenError } from "../utils/errors.js";
import { v4 as uuidv4 } from "uuid";

const BASE = "/tables/:tableId/rows";

const ACCESS_LEVEL = {
  admin: 3,
  user: 2,
  public: 1,
};

export default function generateCrudRouter(app) {
  const router = Router();
  const crudApi = new CrudApi(app);

  router.get(BASE, loadTableContext(app), catchError(crudApi.getAllHandler()));
  router.get(
    `${BASE}/:rowId`,
    loadTableContext(app),
    catchError(crudApi.getOneHandler())
  );
  router.post(
    BASE,
    loadTableContext(app),
    catchError(crudApi.createOneHandler())
  );
  router.patch(
    `${BASE}/:rowId`,
    loadTableContext(app),
    catchError(crudApi.updateOneHandler())
  );
  router.delete(
    `${BASE}/:rowId`,
    loadTableContext(app),
    catchError(crudApi.deleteOneHandler())
  );

  return router;
}

class CrudApi {
  constructor(app) {
    this.app = app;
  }

  // getAll route
  getAllHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      // //JUST FOR TESTING
      table.getAllRule = "public";

      // Sets access level depending on the role of the user
      const sessionAccessLevel = req.session.hasOwnProperty("user")
        ? ACCESS_LEVEL[req.session.user.role]
        : ACCESS_LEVEL["public"];

      const requiredAccessLevel = ACCESS_LEVEL[table.getAllRule];
      // console.log(sessionAccessLevel, requiredAccessLevel);

      // If the user doesn't have the appropriate access level, boot them.
      if (requiredAccessLevel > sessionAccessLevel) {
        throw new ForbiddenError(
          "You don't have the appropriate access for this table."
        );
      }

      // check if table requires specific rules
      // check if logged in user has a role that allows for table specific rule
      // if not, throw ForbiddenError

      const rows = await this.app.getDAO().getAll(table.name);
      const event = {
        table,
        rows,
        res,
      };
      this.app.onGetAllRows().trigger(event);
      if (event.res.finished) return null;
      res.status(200).json({
        table: {
          id: table.id,
          name: table.name,
        },
        rows: event.rows,
      });
    };
  }

  // getOne route
  getOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      const row = await this.app.getDAO().getOne(table.name, rowId);
      if (!row.length) throw new BadRequestError();
      res.status(200).json({ row });
    };
  }

  // createOne route
  createOneHandler() {
    return async (req, res, next) => {
      //validate the schema and here before creating ???
      const { table } = res.locals;
      const createdRow = await this.app
        .getDAO()
        .createOne(table.name, { ...req.body, id: uuidv4() });
      res.status(201).json({ createdRow });
    };
  }

  // updateOne route
  updateOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      const updatedRow = await this.app
        .getDAO()
        .updateOne(table.name, rowId, req.body);
      res.status(200).json({ updatedRow });
    };
  }

  // deleteOne route
  deleteOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      await this.app.getDAO().deleteOne(table.name, rowId);
      res.status(204).end();
    };
  }
}

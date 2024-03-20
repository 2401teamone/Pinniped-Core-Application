import { Router } from "express";
import loadTableContext from "../middleware/load_table_context.js";
import apiRules from "../middleware/api_rules.js";
import validateRecord from "../middleware/validate_record.js";
import stringifyJsonColumns from "../middleware/stringify_json.js";
import parseJsonColumns from "../../utils/parse_json_columns.js";
import catchError from "../../utils/catch_error.js";
import { BadRequestError, ForbiddenError } from "../../utils/errors.js";
import { v4 as uuidv4 } from "uuid";

const BASE = "/:tableId/rows";

/**
 * Creates an Express Router object
 * That sets middleware and handlers for
 * The designated CRUD routes.
 * @param {object HB} app
 * @returns {object Router} router
 */
export default function generateCrudRouter(app) {
  const router = Router();
  const crudApi = new CrudApi(app);

  router.get(
    BASE,
    loadTableContext(app),
    apiRules(app),
    catchError(crudApi.getAllHandler())
  );

  router.get(
    `${BASE}/:rowId`,
    loadTableContext(app),
    apiRules(app),
    catchError(crudApi.getOneHandler())
  );
  router.post(
    BASE,
    loadTableContext(app),
    apiRules(app),
    validateRecord(),
    stringifyJsonColumns(),
    catchError(crudApi.createOneHandler())
  );
  router.patch(
    `${BASE}/:rowId`,
    loadTableContext(app),
    apiRules(app),
    validateRecord(),
    stringifyJsonColumns(),
    catchError(crudApi.updateOneHandler())
  );
  router.delete(
    `${BASE}/:rowId`,
    loadTableContext(app),
    apiRules(app),
    catchError(crudApi.deleteOneHandler())
  );

  return router;
}

/**
 * CrudApi Class
 * Creates an object that contains methods
 * that handles the CRUD operations.
 */
class CrudApi {
  constructor(app) {
    this.app = app;
  }

  /**
   * Returns a handler function that
   * Checks if the user has the required access level
   * And returns all the rows in the provided table.
   * @returns {function}
   */
  getAllHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { pageNum, limit, sortBy, order } = req.query;

      const rows = await this.app
        .getDAO()
        .getAll(table.name, pageNum, limit, sortBy, order);
      parseJsonColumns(table, rows);

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

  /**
   * Returns a handler function that
   * Returns a specific row in a specific table.
   * @returns {function}
   */
  getOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      const row = await this.app.getDAO().getOne(table.name, rowId);
      parseJsonColumns(table, row);
      if (!row.length) throw new BadRequestError();

      //TESTING
      // table.getOneRule = "creator";

      // Row level access control
      if (
        table.getOneRule === "creator" &&
        row[0].userId != req.session.user.id
      ) {
        throw new ForbiddenError();
      }

      res.status(200).json({ row });
    };
  }

  /**
   * Returns a handler function that
   * Creates a row in a specific table.
   * @returns {function}
   */
  createOneHandler() {
    return async (req, res, next) => {
      // Need to Validate the Schema of the Request?
      const { table } = res.locals;

      // validateRecord(table, req.body);

      const createdRow = await this.app
        .getDAO()
        .createOne(table.name, { ...req.body, id: uuidv4() });
      parseJsonColumns(table, createdRow);
      res.status(201).json({
        table: {
          id: table.id,
          name: table.name,
        },
        row: createdRow[0],
      });
    };
  }

  /**
   * Returns a function that
   * Updates a specific row in a specific table.
   * @returns {function}
   */
  updateOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      const updatedRow = await this.app
        .getDAO()
        .updateOne(table.name, rowId, req.body);
      parseJsonColumns(table, updatedRow);
      res.status(200).json({
        table: {
          id: table.id,
          name: table.name,
        },
        row: updatedRow[0],
      });
    };
  }

  /**
   * Returns a function that
   * Deletes a specific row in a specific table.
   * @returns {function}
   */
  deleteOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;
      const { rowId } = req.params;
      await this.app.getDAO().deleteOne(table.name, rowId);
      res.status(204).end();
    };
  }
}

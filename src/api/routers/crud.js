import { Router } from "express";
import loadTableContext from "../middleware/load_table_context.js";
import apiRules from "../middleware/api_rules.js";
import validateRecord from "../middleware/validate_record.js";
import stringifyJsonColumns from "../middleware/stringify_json.js";
import parseJsonColumns from "../../utils/parse_json_columns.js";
import catchError from "../../utils/catch_error.js";
import { BadRequestError, ForbiddenError } from "../../utils/errors.js";
import generateUuid from "../../utils/generate_uuid.js";
import ResponseData from "../../models/response_data.js";
import { creatorAuthCheck, creatorAuthFilter } from "../../utils/row_auth.js";

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

      let rows = await this.app
        .getDAO()
        .getAll(table.name, pageNum, limit, sortBy, order);

      rows = creatorAuthFilter(req.session.user, res, rows);

      parseJsonColumns(table, rows);

      const responseData = new ResponseData(table, rows, res);

      // Fire the onGetAllRows event
      this.app.onGetAllRows().trigger(responseData);

      // If a registered event handler sends a response to the client, early return.
      if (responseData.responseSent()) return null;

      res.status(200).json(responseData.formatAllResponse());
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
      if (!row.length)
        throw new BadRequestError(
          `Row with id ${rowId} not found in table ${table.name}.`
        );

      creatorAuthCheck(req.session.user, res, row);

      parseJsonColumns(table, row);

      const responseData = new ResponseData(table, row, res);

      if (responseData.responseSent()) return null;

      res.status(200).json(responseData.formatOneResponse());
    };
  }

  /**
   * Returns a handler function that
   * Creates a row in a specific table.
   * @returns {function}
   */
  createOneHandler() {
    return async (req, res, next) => {
      const { table } = res.locals;

      if (table.createRule === "creator") {
        req.body.creatorId = req.session.user.id;
      }

      const createdRow = await this.app
        .getDAO()
        .createOne(table.name, { ...req.body, id: generateUuid() });

      parseJsonColumns(table, createdRow);

      const responseData = new ResponseData(table, createdRow, res);

      if (responseData.responseSent()) return null;

      res.status(201).json(responseData.formatOneResponse());
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

      const row = await this.app.getDAO().getOne(table.name, rowId);
      if (!row.length)
        throw new BadRequestError(
          `Row with id ${rowId} not found in table ${table.name}.`
        );

      creatorAuthCheck(req.session.user, res, row);

      const updatedRow = await this.app
        .getDAO()
        .updateOne(table.name, rowId, req.body);

      parseJsonColumns(table, updatedRow);

      const responseData = new ResponseData(table, updatedRow, res);

      if (responseData.responseSent()) return null;

      res.status(200).json(responseData.formatOneResponse());
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

      const row = await this.app.getDAO().getOne(table.name, rowId);
      if (!row.length)
        throw new BadRequestError(
          `Row with id ${rowId} not found in table ${table.name}.`
        );

      creatorAuthCheck(req.session.user, res, row);

      await this.app.getDAO().deleteOne(table.name, rowId);

      const responseData = new ResponseData(table, [], res);

      if (responseData.responseSent()) return null;

      res.status(204).end();
    };
  }
}

import { Router } from 'express';
import loadTableContext from './middleware/load_table_context.js';
import validateRecord from './middleware/validate_record.js';
import catchError from '../utils/catch_error.js';
import { BadRequestError, ForbiddenError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

const BASE = '/tables/:tableId/rows';
const ACCESS_LEVEL = {
  admin: 3,
  user: 2,
  public: 1,
};

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

  router.get(BASE, loadTableContext(app), catchError(crudApi.getAllHandler()));
  router.get(
    `${BASE}/:rowId`,
    loadTableContext(app),
    catchError(crudApi.getOneHandler())
  );
  router.post(
    BASE,
    loadTableContext(app),
    validateRecord(),
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
      // JUST FOR TESTING
      table.getAllRule = 'public';

      // User Access Level
      const sessionAccessLevel = req.session.hasOwnProperty('user')
        ? ACCESS_LEVEL[req.session.user.role]
        : ACCESS_LEVEL['public'];

      // Required Table Access Level
      const requiredAccessLevel = ACCESS_LEVEL[table.getAllRule];
      // console.log(sessionAccessLevel, requiredAccessLevel);

      // If the user doesn't have the appropriate access level, boot them.
      if (requiredAccessLevel > sessionAccessLevel) {
        throw new ForbiddenError(
          "You don't have the appropriate access for this table."
        );
      }

      // Returns the Result
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
      if (!row.length) throw new BadRequestError();
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

      validateRecord(table, req.body);

      const createdRow = await this.app
        .getDAO()
        .createOne(table.name, { ...req.body, id: uuidv4() });
      res.status(201).json({ createdRow });
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
      res.status(200).json({ updatedRow });
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

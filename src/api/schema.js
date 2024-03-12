import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import Table from "../models/table.js";
import loadTableContext from "./middleware/load_table_context.js";
import adminOnly from "./middleware/admin_only.js";
import catchError from "../utils/catch_error.js";
import { BadRequestError } from "../utils/errors.js";

/**
 * Creates an Express Router object
 * That sets middleware and handler functions for
 * The designated schema routes.
 * @param {object HB} app
 * @returns {object Router} router
 */
export default function generateSchemaRouter(app) {
  const router = Router();
  const schemaApi = new SchemaApi(app);

  // router.use(adminOnly());
  router.get("/", catchError(schemaApi.getAllTablesHandler()));
  router.post("/", catchError(schemaApi.createTableHandler()));
  router.get("/:tableId", catchError(schemaApi.getTableHandler()));
  router.put("/:tableId", catchError(schemaApi.updateTableHandler()));
  router.delete("/:tableId", catchError(schemaApi.dropTableHandler()));

  return router;
}

/**
 * SchemaApi Class
 * Creates an object that contains the methods needed for schema changes.
 */
class SchemaApi {
  constructor(app) {
    this.app = app;
  }

  /**
   * Returns a function that grabs all the rows from 'tablemeta'.
   * Each row in 'tablemeta' represents a table in the Sqlite3 database.
   * @returns {function}
   */
  getAllTablesHandler() {
    return async (req, res, next) => {
      let allTableMeta = await this.app.getDAO().getAll("tablemeta");
      allTableMeta = allTableMeta.map((table) => new Table(table));
      console.log(allTableMeta);
      res.json(allTableMeta);
    };
  }

  getTableHandler() {
    return async (req, res, next) => {
      // get all tables from _tables table via app.getDao().getAllTables()
      // Instantiate each table instance
      // get table and instanciate new table instance that has things like: name, rules, schema columns, etc.
    };
  }

  /**
   * Returns a handler function that creates a table to the database.
   * It adds the metadata of the new table to 'tablemeta',
   * And creates the table within the Sqlite3 database using the DAO instance.
   * @returns {function}
   */
  createTableHandler() {
    return async (req, res, next) => {
      const newTable = new Table(req.body);

      await Table.validateMigration(null, newTable, this.app);

      await newTable.create();

      res.status(200).json({ newTable });
    };
  }

  /**
   * Returns a handler function that updates the table schema in the database.
   * It searches for the specific row in 'tablemeta' that represents the table to be updated,
   * And updates that row with the requested information.
   * Then it updates that table's schema within the Sqlite database.
   * @returns {function}
   */
  updateTableHandler() {
    return async (req, res, next) => {
      const { tableId } = req.params;

      // Find the specific row (representing a table) in 'tablemeta'.
      let tableFromMeta = await this.app.getDAO().findTableById(tableId);
      if (!tableFromMeta)
        throw new BadRequestError("Table not found in metadata table.");

      tableFromMeta = tableFromMeta[0];
      tableFromMeta.columns = JSON.parse(tableFromMeta.columns);
      console.log(tableFromMeta, "Table Found in tablemeta");

      // Creates two table instances based on the existing table schema and newly requested table schema.
      const oldTable = new Table(tableFromMeta);
      const newTable = new Table(req.body);
      Table.validateMigration(oldTable, newTable, this.app);

      oldTable.updateTo(newTable);

      // await Table.migrate(oldTable, newTable, this.app);
      // console.log(newTable);
      res.json(newTable);
    };
  }

  /**
   * Returns a handler function that drops the specified table
   * Based on the tableId passed in the request.
   * The table is dropped from the Sqlite3 database,
   * And the associated row in 'tablemeta' is dropped.
   * @returns {function}
   */
  dropTableHandler() {
    return async (req, res, next) => {
      const { tableId } = req.params;
      let tableFromMeta = await this.app.getDAO().findTableById(tableId);

      if (!tableFromMeta.length)
        throw new BadRequestError("Unable to find the table.");
      tableFromMeta = tableFromMeta[0];

      let tableToDelete = new Table(tableFromMeta);

      tableToDelete.drop();

      res.status(204).json({ message: "Table Dropped" });
    };
  }
}

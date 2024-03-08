import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import Table from "../models/table.js";
import catchError from "../utils/catch_error.js";

import loadTableContext from "./middleware/load_table_context.js";
import adminOnly from "./middleware/admin_only.js";
import { BadRequestError } from "../utils/errors.js";

export default function generateSchemaRouter(app) {
  const router = Router();
  const schemaApi = new SchemaApi(app);

  // router.use(adminOnly());
  router.get("/", catchError(schemaApi.getAllTablesHandler()));
  router.post("/", catchError(schemaApi.createTableHandler()));
  router.get("/:tableId", catchError(schemaApi.getTableHandler()));
  router.put("/:id", catchError(schemaApi.updateTableHandler()));
  router.delete("/:tableId", catchError(schemaApi.dropTableHandler()));

  return router;
}

class SchemaApi {
  constructor(app) {
    this.app = app;
  }

  getAllTablesHandler() {
    return async (req, res, next) => {
      const allTableMeta = await this.app.getDAO().getAll("tablemeta");
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
   * Body:
   * id
   * name
   * getAllRule; getOneRule; createOneRule; updateOneRule; deleteOneRule
   * columns: [{id, name, type, required, unique, default, etc.}]
   * type options = text; number; boolean; date; json; relation, etc.
   */
  createTableHandler() {
    return async (req, res, next) => {
      const { name, columns } = req.body;

      const newTable = new Table({ name, columns });
      newTable.generateId(); // Put this into the Table constructor //

      // within transaction
      this.app.getDAO().runTransaction(async (trx) => {
        // add row to tablemeta
        let newTableMetaData = await this.app.getDAO().addTableMetaData(
          {
            id: newTable.id,
            name: newTable.name,
            columns: newTable.stringifyColumns(),
          },
          trx
        );

        // add table to sqlite
        await this.app.getDAO().createTable(newTable, trx);
        console.log(newTable);
        res.json(newTableMetaData);
      });
    };
  }

  updateTableHandler() {
    return async (req, res, next) => {
      const { name, columns } = req.body;
      const { id } = req.params;

      let tableFromMeta = await this.app.getDAO().search("tablemeta", { id });

      if (!tableFromMeta)
        throw new BadRequestError("Table not found in metadata table.");

      console.log(tableFromMeta, "table from meta");
      tableFromMeta = tableFromMeta[0];

      tableFromMeta.columns = JSON.parse(tableFromMeta.columns);

      const oldTable = new Table(tableFromMeta);
      const newTable = new Table({ id, name, columns });

      if (oldTable.id !== newTable.id) {
        throw new BadRequestError("Table ID cannot be changed.");
      }

      await Table.migrate(oldTable, newTable, this.app);

      res.json(newTable);
    };
  }

  dropTableHandler() {
    return async (req, res, next) => {
      const { tableId } = req.params;
      let tableFromMeta = await this.app
        .getDAO()
        .search("tablemeta", { id: tableId });
      if (!tableFromMeta.length) {
        throw new BadRequestError("Unable to find the table");
      }

      tableFromMeta = tableFromMeta[0];

      this.app.getDAO().runTransaction(async (trx) => {
        await this.app.getDAO().dropTable(tableFromMeta.name, trx);
        await this.app.getDAO().deleteTableMetaData(tableId, trx);
        res.status(204).json({ message: "Table dropped" });
      });
    };
  }
}

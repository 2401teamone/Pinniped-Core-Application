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

  router.use(adminOnly());
  router.get("/", catchError(schemaApi.getAllTablesHandler()));
  router.post("/", catchError(schemaApi.createTableHandler()));
  router.get("/:table", catchError(schemaApi.getTableHandler()));
  router.put("/:id", catchError(schemaApi.updateTableHandler()));
  router.delete("/:table", catchError(schemaApi.dropTableHandler()));

  return router;
}

class SchemaApi {
  constructor(app) {
    this.app = app;
  }

  getAllTablesHandler() {
    return async (req, res, next) => {
      // Grabs the Main Table which contains all tables

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
      const { name, schema } = req.body;

      // create a new table instance
      // autogenerate id for table
      // create column instances for each column
      // autogenerate column id's

      const newTable = new Table({ name, schema });
      newTable.generateId();

      // within transaction
      this.app.getDAO().runTransaction(async (trx) => {
        // add row to tablemeta
        let newTableMetaData = await this.app
          .getDAO()
          .addTableMetaData(newTable, trx);

        // add table to sqlite
        await this.app.getDAO().createTable(newTable, trx);
        console.log(newTable);
        res.json(newTableMetaData);
      });
    };
  }

  updateTableHandler() {
    return async (req, res, next) => {
      const { name, schema } = req.body;
      const { id } = req.params;

      let tableFromMeta = await this.app.getDAO().search("tablemeta", { id });

      if (!tableFromMeta)
        throw new BadRequestError("Table not found in metadata table.");

      console.log(tableFromMeta, "table from meta");
      tableFromMeta = tableFromMeta[0];

      tableFromMeta.schema = JSON.parse(tableFromMeta.schema);

      const oldTable = new Table({
        id: tableFromMeta.id,
        name: tableFromMeta.name,
        schema: tableFromMeta.schema.columns,
      });
      const newTable = new Table({ id, name, schema });

      if (oldTable.id !== newTable.id) {
        throw new BadRequestError("Table ID cannot be changed.");
      }

      await Table.migrate(oldTable, newTable, this.app);

      res.json(newTable);
    };
  }

  dropTableHandler() {
    return async (req, res, next) => {
      const { table } = req.params;
      this.app.getDAO().runTransaction(async (trx) => {
        await this.app.getDAO().dropTable(table, trx);
        await this.app.getDAO().deleteTableMetaData(table, trx);
        res.status(204).json({ message: "Table dropped" });
      });
    };
  }
}

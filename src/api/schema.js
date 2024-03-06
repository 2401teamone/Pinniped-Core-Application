import { Router } from "express";
import loadTableContext from "./middleware/load_table_context.js";
import catchError from "../utils/catch_error.js";
import { BadRequestError } from "../utils/errors.js";
import Table from "../models/table.js";
import { v4 as uuidv4 } from "uuid";

export default function generateSchemaRouter(app) {
  const router = Router();
  const schemaApi = new SchemaApi(app);

  router.get("/", catchError(schemaApi.getAllTablesHandler()));
  router.post("/", catchError(schemaApi.createTableHandler()));
  router.get("/:table", catchError(schemaApi.getTableHandler()));
  router.put("/", catchError(schemaApi.updateTableHandler()));
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

      // create a new table instance
      // autogenerate id for table
      // create column instances for each column
      // autogenerate column id's

      const newTable = new Table({ name, columns });

      console.log(newTable);
      console.log(newTable.columns);

      // within transaction
      this.app.getDAO().runTransaction(async (trx) => {
        // add row to tablemeta
        let newTableMetaData = await this.app
          .getDAO()
          .addTableMetaData(newTable, trx);

        // add table to sqlite
        await this.app.getDAO().createTable(newTable, trx);
        res.json(newTableMetaData);
      });
    };
  }

  updateTableHandler() {
    return async (req, res, next) => {
      const { id, name, columns } = req.body;

      let tableFromMeta = await this.app.getDAO().search("tablemeta", { id });

      if (!tableFromMeta)
        throw new BadRequestError("Table not found in metadata table.");
      tableFromMeta = tableFromMeta[0];

      tableFromMeta.columns = JSON.parse(tableFromMeta.columns);

      const oldTable = new Table(tableFromMeta);
      const newTable = new Table({ id, name, columns });

      Table.migrate(oldTable, newTable, this.app);
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

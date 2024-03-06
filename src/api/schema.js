import { Router } from 'express';
import loadTableContext from './middleware/load_table_context.js';
import catchError from '../utils/catch_error.js';
import { BadRequestError } from '../utils/errors.js';
import Table from '../models/table.js';

export default function generateSchemaRouter(app) {
  const router = Router();
  const schemaApi = new SchemaApi(app);

  router.get('/', catchError(schemaApi.getAllTablesHandler()));
  router.post('/', catchError(schemaApi.createTableHandler()));
  router.get('/:table', catchError(schemaApi.getTableHandler()));
  router.patch('/:table', catchError(schemaApi.updateTableHandler()));
  router.delete('/:table', catchError(schemaApi.dropTableHandler()));

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
      // within transaction
      this.app.getDAO().runTransaction(async (trx) => {
        // add row to tablemeta
        let newTable = await this.app
          .getDAO()
          .addTableMetaData(name, columns, trx);

        // add table to sqlite
        await this.app.getDAO().createTable(name, columns, trx);
        res.json(newTable);
      });
    };
  }

  updateTableHandler() {
    return async (req, res, next) => {
      const { id, name, columns } = req.body;

      const tableFromMeta = this.app.getDAO().findTableByName(name);
      if (!tableFromMeta)
        throw new BadRequestError('Table not found in metadata table.');

      const oldTable = new Table(tableFromMeta);
      const newTable = new Table(id, name, columns);

      // Check Column Length
      //  Deleted Column
      //  Renamed Column

      res.json(table);
    };
  }

  dropTableHandler() {
    return async (req, res, next) => {
      const { table } = req.params;
      this.app.getDAO().runTransaction(async (trx) => {
        await this.app.getDAO().dropTable(table, trx);
        await this.app.getDAO().deleteTableMetaData(table, trx);
        res.status(204).json({ message: 'Table dropped' });
      });
    };
  }
}

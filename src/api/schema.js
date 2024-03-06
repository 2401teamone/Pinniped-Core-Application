import { Router } from 'express';
import loadTableContext from './middleware/load_table_context.js';
import catchError from '../utils/catch_error.js';
import { BadRequestError } from '../utils/errors.js';

export default function generateSchemaRouter(app) {
  const router = Router();
  const schemaApi = new SchemaApi(app);

  router.get('/', schemaApi.getAllTablesHandler());
  router.post('/', schemaApi.createTableHandler());
  router.get('/:tablename', schemaApi.getTableHandler());
  router.patch('/:tablename', schemaApi.updateTableHandler());
  router.delete('/:tablename', schemaApi.dropTableHandler());

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
    return async (req, res, next) => {};
  }

  dropTableHandler() {
    return async (req, res, next) => {
      // drop table from database
      /**
       * PB actually running Go version of this... await dao.DB().raw(`DROP TABLE IF EXISTS ${tableName}`))
       * knex.schema.dropTableIfExists(tableName)
      // delete row from _tables table
      */
    };
  }
}

import Schema from "./schema.js";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_RULE = "user";

class Table {
  constructor({ id, name, schema, rules = {} }) {
    this.id = id;
    this.name = name;
    // this.type = type;

    this.schema = new Schema(schema);

    this.getAllRule = rules.getAllRule || DEFAULT_RULE;
    this.getOneRule = rules.getOneRule || DEFAULT_RULE;
    this.createRule = rules.createRule || DEFAULT_RULE;
    this.updateRule = rules.updateRule || DEFAULT_RULE;
    this.deleteRule = rules.deleteRule || DEFAULT_RULE;
  }

  generateId() {
    this.id = uuidv4();
  }

  //Loop over the old table and new table, and run DDL operations
  //to make the SQLite table in question match the new table info
  static async migrate(oldTable, newTable, app) {
    console.log("MIGRATING");
    console.log(oldTable, newTable);
    const oldTableName = oldTable.name;
    const newTableName = newTable.name;
    const oldColumns = oldTable.schema.getColumns();
    const newColumns = newTable.schema.getColumns();

    app.getDAO().runTransaction(async (trx) => {
      // Delete Columns
      for (let column of oldColumns) {
        if (newTable.schema.getColumnById(column.id)) continue;
        await app.getDAO().dropColumn(oldTable.name, column.name, trx);
      }

      // Add OR Rename Columns
      for (let column of newColumns) {
        let match = oldTable.schema.getColumnById(column.id);
        if (match === null)
          await app.getDAO().addColumn(oldTable.name, column, trx);

        if (match && match.name !== column.name) {
          await app
            .getDAO()
            .renameColumn(oldTableName, match.name, column.name, trx);
        }
      }

      // Rename Table - WORKING (on its own)
      //Run a DDL method on the table in question, updating it's name
      //to match the newTable name
      if (oldTable.name !== newTable.name) {
        await app.getDAO().renameTable(oldTableName, newTableName, trx);
      }

      await app.getDAO().updateTableMetaData(newTable, trx);
    });
  }
}

export default Table;

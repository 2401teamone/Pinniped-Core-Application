import Columns from "./columns.js";
import { v4 as uuidv4 } from "uuid";

class Table {
  constructor({ id = uuidv4(), name, columns, rules = {} }) {
    this.name = name;
    this.id = id;
    // this.type = type;

    this.columns = new Columns(columns);

    this.getAllRule = rules.getAllRule;
    this.getOneRule = rules.getOneRule;
    this.createRule = rules.createRule;
    this.updateRule = rules.updateRule;
    this.deleteRule = rules.deleteRule;
  }

  getColumns() {
    return this.columns;
  }

  //Loop over the old table and new table, and run DDL operations
  //to make the SQLite table in question match the new table info
  static migrate(oldTable, newTable, app) {
    const oldTableName = oldTable.name;
    const tableName = newTable.name;
    const oldColumns = oldTable.getColumns();
    const newColumns = newTable.getColumns();

    app.getDAO().runTransaction(async (trx) => {
      // Add Columns
      // for (let column of newColumns) {
      //   if (oldColumns.getAllRule(column.id)) continue;
      //   await app
      //     .getDAO()
      //     .addColumn(newTable, column.name, column.options, trx);
      // }

      // Delete Columns
      for (let column of oldColumns) {
        if (newColumns.getColumnById(column.id)) continue;

        await app.getDAO().dropColumn(tableName, column.name);
      }

      // Add OR Rename Columns
      for (let column of newColumns) {
        let match = oldColumns.getColumnById(column.id);
        if (match === null) await app.getDAO().addColumn(oldTable.name, column);

        if (match && match.name != column.name) {
          await app
            .getDAO()
            .renameColumn(oldTableName, match.name, column.name, trx);
        }
      }

      // Rename Table
      if (oldTable.name !== newTable.name) {
        //Run a DDL method on the table in question, updating it's name
        //to match the newTable name
        await app.getDAO().renameTable(oldTableName, tableName, trx);
      }
    });
  }
}

export default Table;

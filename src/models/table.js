import Columns from "./columns.js";

class Table {
  constructor({ id, name, columns, rules = {} }) {
    this.name = name;
    this.id = id;
    // this.type = type;

    this.schema = new Columns(columns);

    this.getAllRule = rules.getAllRule;
    this.getOneRule = rules.getOneRule;
    this.createRule = rules.createRule;
    this.updateRule = rules.updateRule;
    this.deleteRule = rules.deleteRule;
  }

  //Loop over the old table and new table, and run DDL operations
  //to make the SQLite table in question match the new table info
  static migrate(oldTable, newTable, app) {
    app.getDAO().runTransaction(async (trx) => {
      // Rename Table
      if (oldTable.name !== newTable.name) {
        //Run a DDL method on the table in question, updating it's name
        //to match the newTable name
        await app.getDAO().renameTable(oldTable.name, newTable.name, trx);
      }
    });
  }
}

export default Table;

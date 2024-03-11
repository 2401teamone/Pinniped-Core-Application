import Column from "./column.js";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_RULE = "public";

class Table {
  /**
   * Migrate
   * @param {object Table} oldTable
   * @param {object Table} newTable
   * @param {object HB} app
   * Induces schema changes based on the comparison between the old table and the new table.
   * It'll loop through the columns property, looking for whether
   * (Add Column) The column exists in the new table but not the old,
   * (Delete Column) The column doesn't exist in the new table but in the old,
   * (Rename Column) The column exists in both, but has a different name in the two tables.
   */
  static async migrate(oldTable, newTable, app) {
    const oldTableName = oldTable.name;
    const newTableName = newTable.name;
    const oldColumns = oldTable.getColumns();
    const newColumns = newTable.getColumns();
    console.log("MIGRATING");
    console.log(oldTable, newTable);

    app.getDAO().runTransaction(async (trx) => {
      // Delete Columns
      for (let column of oldColumns) {
        if (newTable.getColumnById(column.id)) continue;
        await app.getDAO().dropColumn(oldTable.name, column.name, trx);
      }

      // Add OR Rename Columns
      for (let column of newColumns) {
        let match = oldTable.getColumnById(column.id);
        if (match === null)
          await app.getDAO().addColumn(oldTable.name, column, trx);

        if (match && match.name !== column.name) {
          await app
            .getDAO()
            .renameColumn(oldTableName, match.name, column.name, trx);
        }
      }

      // Rename Table - WORKING (on its own)
      // Run a DDL method on the table in question,
      // updating it's name to match the newTable name.
      if (oldTable.name !== newTable.name) {
        await app.getDAO().renameTable(oldTableName, newTableName, trx);
      }

      await app
        .getDAO()
        .updateTableMetaData(
          { ...newTable, columns: newTable.stringifyColumns() },
          trx
        );
    });
  }

  constructor({
    id,
    name,
    columns,
    getAllRule,
    getOneRule,
    createRule,
    updateRule,
    deleteRule,
  }) {
    this.id = id;
    this.name = name;

    if (typeof columns === "string") {
      columns = JSON.parse(columns);
    }
    this.columns = columns.map((column) => new Column({ ...column }));

    this.getAllRule = getAllRule || DEFAULT_RULE;
    this.getOneRule = getOneRule || DEFAULT_RULE;
    this.createRule = createRule || DEFAULT_RULE;
    this.updateRule = updateRule || DEFAULT_RULE;
    this.deleteRule = deleteRule || DEFAULT_RULE;
  }

  generateId() {
    this.id = uuidv4();
  }

  getColumns() {
    return this.columns;
  }

  stringifyColumns() {
    return JSON.stringify(this.getColumns());
  }

  getColumnById(id) {
    let foundColumn = this.columns.find((column) => column.id === id);
    if (!foundColumn) return null;
    return foundColumn;
  }

  initializeIds() {
    this.columns.forEach((column) => column.initializeId());
  }
}

export default Table;

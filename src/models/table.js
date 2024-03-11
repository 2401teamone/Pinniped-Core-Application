import Column from "./column.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import knex from "knex";

class Table {
  static API_RULES = [
    "getAllRule",
    "getOneRule",
    "createRule",
    "updateRule",
    "deleteRule",
  ];
  static API_RULE_VALUES = ["public", "user", "creator", "admin"];
  static DEFAULT_RULE = "public";

  static async createTableMigration(table, app) {
    let db = knex({
      client: "better-sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "hb.db",
      },
      debug: true,
    });

    await app.getDAO().getDB().destroy();

    // Creates a migration file and returns the full filepath to the newly created
    // Migration file
    // const knex = app.getDAO().getDB();

    //does not
    let returnValue = await db.migrate.make(`create_${table.name}`);

    await db.destroy();

    console.log("Return value from Migrate Create: ", returnValue);

    const migrateTemplate = `/**
    * @param { import("knex").Knex } knex
    * @returns { Promise<void> }
    */

    export function up(knex) {
      return knex.schema.createTable("please", (table) => {
        table.string("pleaseWork");
      });
    }
    
    /**
     * @param { import("knex").Knex } knex
     * @returns { Promise<void> }
     */
    export function down(knex) {
      return knex.schema.dropTable("please");
    }
   `;

    //this is working
    fs.writeFileSync(returnValue, migrateTemplate);

    // console.log("this is the knex.migrate: ", db.migrate);
    // console.log("this is the knex.migrate.list: ", db.migrate.list.toString());
    // console.log("knex log: ", knex);

    // const list = await db.migrate.list();
    // console.log(list);

    // db = knex({
    //   client: "better-sqlite3",
    //   useNullAsDefault: true,
    //   connection: {
    //     filename: "hb.db",
    //   },
    //   debug: true,
    // });

    // console.log("migrations list: ", list);
    // let result = await db.migrate.up();

    // const afterList = await db.migrate.list();
    // console.log("migractions after: ", afterList);
    // console.log("migrations list after migrate: ", await db.migrate.list());
    // console.log(await db.migrate.currentVersion());
    // console.log(result);

    // await db.destroy(); // MUST CLOSE CONNECTION AFTER RUNNING MIGRATIONS OR SOCKET WILL HANG
  }

  /**
   * Validates the object, newTable, to ensure it meets the requirements
   * Before adding the table to the database.
   * @param {object Table} oldTable
   * @param {object Table} newTable
   * @param {object HB} app
   */
  static async validateMigration(oldTable, newTable, app) {
    if (!newTable.id) throw new Error("The table doesn't have a valid ID.");
    // Validate ID shape
    if (!newTable.name) throw new Error("The table must have a name.");

    if (!oldTable) {
      const existingTable = await app.getDAO().findTableByName(newTable.name);
      if (existingTable.length) {
        throw new Error("The table name already exists.");
      }
    }

    if (newTable.columns.length === 0) {
      throw new Error("The table must have at least one column.");
    }
    if (!newTable.columns.every((column) => column.id)) {
      throw new Error("Columns must have IDs.");
    }
    if (!newTable.columns.every((column) => column.name)) {
      throw new Error("All columns must have names.");
    }
    if (!newTable.columns.every((column) => column.type)) {
      throw new Error("All columns must have types.");
    }
    if (!newTable.columns.every((column) => Column.isValidType(column.type))) {
      throw new Error(
        `Invalid type passed: valid types are ${Object.keys(Column.COLUMN_MAP)}`
      );
    }

    if (
      newTable.columns.some(
        (column) =>
          column.name === "id" ||
          column.name === "created_at" ||
          column.name === "updated_at"
      )
    ) {
      throw new Error(
        "Cannot add a column with a name of id, created_at, or updated_at"
      );
    }

    let colNames = newTable.columns.map((column) => column.name);
    let setNames = new Set(colNames);
    if (colNames.length !== setNames.size) {
      throw new Error("All column names must be unique for a single table.");
    }

    Table.API_RULES.forEach((rule) => {
      if (!Table.API_RULE_VALUES.includes(newTable[rule])) {
        throw new Error(`Invalid ${rule}: ${newTable[rule]}`);
      }
    });

    if (oldTable !== null) {
      if (oldTable.id !== newTable.id) {
        throw new Error("Table ID cannot be changed.");
      }
      console.log("checking against oldTable");
      // no column type changes

      // no relationship
    }
  }

  /**
   * Induces schema changes based on the comparison between the old table and the new table.
   * It'll loop through the columns property, looking for whether
   * (Add Column) The column exists in the new table but not the old,
   * (Delete Column) The column doesn't exist in the new table but in the old,
   * (Rename Column) The column exists in both, but has a different name in the two tables.
   * @param {object Table} oldTable
   * @param {object Table} newTable
   * @param {object HB} app
   */
  static async migrate(oldTable, newTable, app) {
    console.log("MIGRATING");
    console.log(oldTable, newTable);

    const oldTableName = oldTable.name;
    const newTableName = newTable.name;
    const oldColumns = oldTable.getColumns();
    const newColumns = newTable.getColumns();

    app.getDAO().runTransaction(async (trx) => {
      // Delete Columns
      for (let column of oldColumns) {
        if (newTable.getColumnById(column.id)) continue;
        await app.getDAO().dropColumn(oldTable.name, column.name, trx);
      }

      // Add OR Rename Columns
      for (let column of newColumns) {
        let match = oldTable.getColumnById(column.id);
        if (match === null) {
          await app.getDAO().addColumn(oldTable.name, column, trx);
        }
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
    id = uuidv4(),
    name = "",
    columns = [],
    getAllRule = Table.DEFAULT_RULE,
    getOneRule = Table.DEFAULT_RULE,
    createRule = Table.DEFAULT_RULE,
    updateRule = Table.DEFAULT_RULE,
    deleteRule = Table.DEFAULT_RULE,
  }) {
    this.id = id;
    this.name = name;

    if (typeof columns === "string") {
      columns = JSON.parse(columns);
    }
    this.columns = columns.map((column) => new Column({ ...column }));

    this.getAllRule = getAllRule;
    this.getOneRule = getOneRule;
    this.createRule = createRule;
    this.deleteRule = deleteRule;
    this.updateRule = updateRule;
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

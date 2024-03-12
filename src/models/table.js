import Column from "./column.js";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import knex from "knex";
import DAO from "../dao/dao.js";

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

  getNewConnection() {
    return new DAO().getDB();
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

  /**
   * Creates a migration file in /migrations and uses migration template to
   * write `up` and `down` functions to the file. Runs the the `up` method in the
   * newly created migration file.
   * @returns {undefined}
   */
  async create() {
    const db = this.getNewConnection();

    let filePath = await db.migrate.make(`create_table_${this.name}`);

    const stringTable = JSON.stringify(this);

    const stringTableMetaRow = JSON.stringify({
      ...this,
      columns: this.stringifyColumns(),
    });

    const migrateTemplate = `/**
      * @param { import("knex").Knex } knex
      * @returns { Promise<void> }
      */
      import DAO from "../src/dao/dao.js";

      export async function up(knex) {
        const dao = new DAO("", knex);

        await dao.createTable(${stringTable});

        await dao.addTableMetaData(${stringTableMetaRow})
      }

      /**
       * @param { import("knex").Knex } knex
       * @returns { Promise<void> }
       */
      export async function down(knex) {
        const dao = new DAO("", knex);

        await dao.dropTable("${this.name}");

        await dao.deleteTableMetaData("${this.id}");
      }
     `;

    fs.writeFileSync(filePath, migrateTemplate);

    await db.migrate.up();

    // MUST CLOSE CONNECTION AFTER RUNNING MIGRATIONS OR SOCKET WILL HANG
    await db.destroy();
  }

  /**
   * Creates a migration file in /migrations and uses migration template to
   * write `up` and `down` functions to the file. Runs the the `up` method in the
   * newly created migration file.
   * @param {object Table} newTable
   * @returns {undefined}
   */
  async drop() {
    let db = this.getNewConnection();

    let filePath = await db.migrate.make(`drop_table_${this.name}`);

    const stringTable = JSON.stringify(this);

    const stringTableMetaRow = JSON.stringify({
      ...this,
      columns: this.stringifyColumns(),
    });

    const migrateTemplate = `/**
        * @param { import("knex").Knex } knex
        * @returns { Promise<void> }
        */
        import DAO from "../src/dao/dao.js";

        export async function up(knex) {
          const dao = new DAO("", knex);

          await dao.dropTable("${this.name}");

          await dao.deleteTableMetaData("${this.id}");
        }

        /**
         * @param { import("knex").Knex } knex
         * @returns { Promise<void> }
         */
        export async function down(knex) {
          const dao = new DAO("", knex);

          await dao.createTable(${stringTable});

          await dao.addTableMetaData(${stringTableMetaRow})
        }
       `;

    fs.writeFileSync(filePath, migrateTemplate);

    await db.migrate.up();

    // MUST CLOSE CONNECTION AFTER RUNNING MIGRATIONS OR SOCKET WILL HANG
    await db.destroy();
  }

  /**
   * Creates a migration file in /migrations and uses migration template to
   * write `up` and `down` functions to the file. Runs the the `up` method in the
   * newly created migration file.
   * @param {object Table} newTable
   * @returns {undefined}
   */

  async updateTo(newTable) {
    const db = this.getNewConnection();

    const oldTableName = this.name;
    const newTableName = newTable.name;
    const oldColumns = this.getColumns();
    const newColumns = newTable.getColumns();

    let filePath = await db.migrate.make(`update_table_${oldTableName}`);

    const stringTableMetaRow = JSON.stringify({
      ...newTable,
      columns: newTable.stringifyColumns(),
    });

    const oldStringTableMetaRow = JSON.stringify({
      ...this,
      columns: this.stringifyColumns(),
    });

    const migrateTemplate = `
    import DAO from "../src/dao/dao.js";

    export async function up(knex) {
      const oldTable = ${JSON.stringify(this)};
      const newTable = ${JSON.stringify(newTable)};
      const oldColumns = ${JSON.stringify(oldColumns)};
      const newColumns = ${JSON.stringify(newColumns)};

      const dao = new DAO("", knex);

      // Delete Columns
      for (let oldColumn of oldColumns) {
        if (newColumns.find((newColumn) => oldColumn.id === newColumn.id)) continue;
        await dao.dropColumn(oldTable.name, oldColumn.name);
      }

      // Add OR Rename Columns
      for (let newColumn of newColumns) {
        let match = oldColumns.find((oldColumn) => oldColumn.id === newColumn.id);
        if (!match) {
          await dao.addColumn(oldTable.name, newColumn);
        }
        if (match && match.name !== newColumn.name) {
          await dao.renameColumn(oldTable.name, match.name, newColumn.name);
        }
      }

      // sets the table meta to the new table
      dao.updateTableMetaData(${stringTableMetaRow})
    }

    export async function down(knex) {
      //Run the exact same logic as the up method, but with new and old variables
      //swapped..
      const oldTable = ${JSON.stringify(newTable)};
      const newTable = ${JSON.stringify(this)};
      const oldColumns = ${JSON.stringify(newColumns)};
      const newColumns = ${JSON.stringify(oldColumns)};

      const dao = new DAO("", knex);

      // sets the table meta to the old table
      dao.updateTableMetaData(${oldStringTableMetaRow})
    }

   `;
    // // Delete Columns
    // for (let column of oldColumns) {
    //   if (newTable.getColumnById(column.id)) continue;
    //   await app.getDAO().dropColumn(oldTableName, column.name, trx);
    // }

    // // Add OR Rename Columns
    // for (let column of newColumns) {
    //   let match = oldTable.getColumnById(column.id);
    //   if (match === null) {
    //     await app.getDAO().addColumn(oldTableName, column, trx);
    //   }
    //   if (match && match.name !== column.name) {
    //     await app
    //       .getDAO()
    //       .renameColumn(oldTableName, match.name, column.name, trx);
    //   }
    // }

    // // Rename Table - WORKING (on its own)
    // // Run a DDL method on the table in question,
    // // updating it's name to match the newTable name.
    // if (oldTableName !== newTableName) {
    //   await app.getDAO().renameTable(oldTableName, newTableName, trx);
    // }

    fs.writeFileSync(filePath, migrateTemplate);

    await db.migrate.up();

    // await app
    //   .getDAO()
    //   .updateTableMetaData(
    //     { ...newTable, columns: newTable.stringifyColumns() },
    //     trx
    //   );
  }
}

export default Table;

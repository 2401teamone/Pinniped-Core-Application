import knex from "knex";
import { DatabaseError, BadRequestError } from "../utils/errors.js";

class DAO {
  constructor(dbFile) {
    this.db = this._connect(dbFile);
  }

  /**
   * _connect
   * @param {string} dbFile
   * @returns {Knex Connection}
   * Connects to the Better-Sqlite3 Database with Knex.
   * Allows for queries to be chained to the returned Knex connection.
   */
  _connect(dbFile) {
    return knex({
      client: "better-sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "hb.db",
      },
    });
  }

  disconnect() {}

  getDB() {
    return this.db;
  }

  /**
   * runTransaction
   * @param {function} callback
   * @return {} result
   *
   */
  async runTransaction(callback) {
    const trx = await this.getDB().transaction();
    try {
      const result = await callback(trx);
      await trx.commit();
      return result;
    } catch (e) {
      await trx.rollback();
      console.log(e);
      throw new Error(e);
    }
  }

  /**
   * findTableByName
   * @param {string} tableName
   * @returns {object Table} table
   * Searches the table 'tablemeta' and filters based on the name parameter.
   * Receives the instance of the Table model if found.
   */
  async findTableByName(tableName) {
    try {
      const table = await this.getDB()("tablemeta")
        .select("*")
        .where({ tableName });
      return table;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * findTableById
   * @param {string} id
   * @returns {object Table} table
   * Searches the table 'tablemeta' and filters based on the ID parameter.
   */
  async findTableById(id) {
    try {
      const table = await this.getDB()("tablemeta").select("*").where({ id });
      return table;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Search
   * @param {string} tableName
   * @param {object} fields
   * @returns {object[]} rows
   * Searches within a table with the given parameter in the database,
   * With the additional parameter, fields, to search for specific rows filtered by specific columns.
   */
  async search(tableName, fields) {
    try {
      console.log(tableName, fields, "SEARCHING");
      const rows = await this.getDB()(tableName).select("*").where(fields);
      return rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * getAll
   * @param {string} tableName
   * @returns {object[]} rows
   * Returns all the rows from the specific queried table.
   */
  async getAll(tableName) {
    try {
      const rows = await this.getDB()(tableName).select("*");
      return rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * getOne
   * @param {string} tableName
   * @param {string} rowId
   * @returns {object[]} row
   * Receives a single row based on the rowId passed, in the table, tableName.
   */
  async getOne(tableName, rowId) {
    try {
      const row = await this.getDB()(tableName)
        .select("*")
        .where({ id: rowId });
      return row;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * createOne
   * @param {string} tableName
   * @returns {object[]} newRow
   * Creates a new row in the specified table and returns the new row.
   */
  async createOne(tableName, newRow) {
    try {
      const createdRow = await this.getDB()(tableName)
        .returning("*")
        .insert(newRow);
      return createdRow;
    } catch (e) {
      console.log(e);
      if (e.message.slice(0, 11) === "insert into") {
        throw new BadRequestError();
      } else {
        throw new Error(e.message);
      }
    }
  }

  /**
   * updateOne
   * @param {string} tableName
   * @param {string} rowId
   * @param {object} newRow
   * @returns {object} updatedRow
   * Finds the row in tableName based on the rowId,
   * And updates that row based on the properties of newRow.
   * Returns updatedRow.
   */
  async updateOne(tableName, rowId, newRow) {
    try {
      const updatedRow = await this.getDB()(tableName)
        .returning("*")
        .where({ id: rowId })
        .update(newRow);
      return updatedRow;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * deleteOne
   * @param {string} tableName
   * @param {string} rowId
   * Deletes the row in tableName based on rowId.
   */
  async deleteOne(tableName, rowId) {
    try {
      await this.getDB()(tableName).where({ id: rowId }).del();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * addTableMetaData
   * @param {id: string, name: string, columns: 'stringJSON'} tableData
   * @param {object Transaction} trx
   * @return {object} createdRow
   * A modified version of createOne, but inserts an object
   * Specifically into 'tablemeta'.
   */
  async addTableMetaData(tableData, trx) {
    const createdRow = await this.getDB()("tablemeta")
      .returning("*")
      .insert(tableData)
      .transacting(trx);
    return createdRow;
  }

  /**
   * addTableMetaData
   * @param {id: string, name: string, columns: stringJSON} tableData
   * @param {object Transaction} trx
   * @return {object} updatedRow
   * Updates the row with changes found in tableData
   */
  async updateTableMetaData(tableData, trx) {
    const updatedRow = await this.getDB()("tablemeta")
      .returning("*")
      .where({ id: tableData.id })
      .update(tableData)
      .transacting(trx);

    return updatedRow;
  }

  /**
   * deleteTableMetaData
   * @param {string} tableId
   * @param {object Transaction} trx
   * @return {Promise <undefined>}
   * Deletes a row from the `tablemeta` table
   * Specifically into 'tablemeta'.
   */
  async deleteTableMetaData(tableId, trx) {
    await this.getDB()("tablemeta")
      .where({ id: tableId })
      .del()
      .transacting(trx);
  }

  /**
   * createTable
   * @param {object Table} table
   * @param {object Transaction} trx
   * @returns {Promise <undefined>}
   * Creates a table within the database and
   */
  async createTable(table, trx) {
    const name = table.name;
    const columns = table.getColumns();

    return await this.getDB()
      .schema.createTable(name, (table) => {
        columns.forEach((column) => {
          if (!table[column.type]) {
            throw new DatabaseError();
          }
          table[column.type](column.name);
        });
        // table.text("id").primary();

        table.specificType(
          "id",
          "TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL"
        );
      })
      .transacting(trx);
  }

  async dropTable(tableName, trx) {
    await this.getDB().schema.dropTable(tableName).transacting(trx);
  }

  async renameTable(tableName, newName, trx) {
    await this.getDB().schema.renameTable(tableName, newName).transacting(trx);
  }

  async addColumn(tableName, column, trx) {
    await this.getDB()
      .schema.table(tableName, (table) => {
        table[column.type](column.name);
      })
      .transacting(trx);
  }

  async renameColumn(tableName, name, newName, trx) {
    await this.getDB()
      .schema.table(tableName, (table) => {
        table.renameColumn(name, newName);
      })
      .transacting(trx);
  }

  async dropColumn(tableName, columnName, trx) {
    await this.getDB()
      .schema.table(tableName, (table) => {
        console.log("DROPPING COLUMN", columnName, " on", tableName);
        table.dropColumn(columnName);
      })
      .transacting(trx);
  }
}

export default DAO;

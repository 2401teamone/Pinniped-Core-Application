import knex from "knex";
import { DatabaseError, BadRequestError } from "../utils/errors.js";

/**
 * DAO (Data Access Object) Class
 * Interacts with Sqlite3 Database through the interface of Knex.
 */
class DAO {
  constructor(dbFile) {
    this.db = this._connect(dbFile);
  }

  /**
   * Connects to the Better-Sqlite3 Database with Knex.
   * Allows for queries to be chained to the returned Knex instance.
   * @param {string} dbFile
   * @returns {Knex Instance}
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

  /**
   * Obtains the Knex instance that connected to the database.
   * If the transaction connection to the database exists,
   * But the transaction is not completed: return this.trxDB.
   * If the transaction connection doesn't exist,
   * Or the transaction is completed: return this.DB.
   * @returns {object Transaction} Knex Instance - this.db || this.trxDB
   */
  getDB() {
    return this.db;
  }

  /**
   * Creates a transaction and invokes the callback given.
   * If the callback is successful, it commits the transaction.
   * Otherwise, it'll rollback the transaction.
   * @param {function} callback
   * @return {undefined} result
   */
  async runTransaction(callback) {
    const trx = await this.getDB().transaction();
    try {
      const result = await callback();
      await trx.commit();
      return result;
    } catch (e) {
      await trx.rollback();
      throw new Error(e);
    }
  }

  /**
   * Searches the table 'tablemeta' and filters based on the name parameter.
   * Receives an instance of Table if found.
   * @param {string} tableName
   * @returns {object Table} table
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
   * Searches the table 'tablemeta' and filters based on the ID parameter.
   * @param {string} id
   * @returns {object Table} table
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
   * With the additional parameter, fields, to search for specific rows filtered by specific columns.
   * Searches within a table with the given parameter in the database,
   * @param {string} tableName
   * @param {object} fields
   * @returns {object[]} rows
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
   * Returns all the rows from the specific queried table.
   * @param {string} tableName
   * @returns {object[]} rows
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
   * Receives a single row based on the rowId passed, in the table, tableName.
   * @param {string} tableName
   * @param {string} rowId
   * @returns {object[]} row
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
   * Creates a new row in the specified table and returns the new row.
   * @param {string} tableName
   * @returns {object[]} newRow
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
   * Finds the row in tableName based on the rowId,
   * And updates that row based on the properties of newRow.
   * Returns updatedRow.
   * @param {string} tableName
   * @param {string} rowId
   * @param {object} newRow
   * @returns {object} updatedRow
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
   * Deletes the row in tableName based on rowId.
   * @param {string} tableName
   * @param {string} rowId
   */
  async deleteOne(tableName, rowId) {
    try {
      await this.getDB()(tableName).where({ id: rowId }).del();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * A modified version of createOne, but inserts an object
   * Specifically into 'tablemeta'.
   * @param {id: string, name: string, columns: 'stringJSON'} tableData
   * @return {object} createdRow
   */
  async addTableMetaData(tableData, trx) {
    const createdRow = await this.getDB()("tablemeta")
      .returning("*")
      .insert(tableData)
      .transacting(trx);
    return createdRow;
  }

  /**
   * Updates the row in 'tablemeta' with the properties contained within tableData.
   * @param {id: string, name: string, columns: stringJSON} tableData
   * @param {object Transaction} trx
   * @return {object} updatedRow
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
   * Deletes a row from the `tablemeta` table
   * Specifically into 'tablemeta'.
   * @param {string} tableId
   * @param {object Transaction} trx
   */
  async deleteTableMetaData(tableId, trx) {
    await this.getDB()("tablemeta")
      .where({ id: tableId })
      .del()
      .transacting(trx);
  }

  /**
   * Creates a table within the database,
   * Then adds the columns to modify the table's structure.
   * @param {object Table} table
   * @param {object Transaction} trx
   * @returns {Promise <undefined>}
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

        table.specificType(
          "id",
          "TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL"
        );
      })
      .transacting(trx);
  }

  /**
   * Drops the specified table from the database.
   * @param {string} tableName
   * @param {object Transaction} trx
   */
  async dropTable(tableName, trx) {
    await this.getDB().schema.dropTable(tableName).transacting(trx);
  }

  /**
   * Renames the current table, tableName, with newName.
   * @param {string} tableName
   * @param {string} newName
   * @param {object Transaction} trx
   */
  async renameTable(tableName, newName, trx) {
    await this.getDB().schema.renameTable(tableName, newName).transacting(trx);
  }

  /**
   * Adds the column to the specified table.
   * @param {string} tableName
   * @param {object Column} column
   * @param {object Transaction} trx
   */
  async addColumn(tableName, column, trx) {
    await this.getDB()
      .schema.table(tableName, (table) => {
        table[column.type](column.name);
      })
      .transacting(trx);
  }

  /**
   * Renames a specific column with newName in table, tableName.
   * @param {string} tableName
   * @param {string} name
   * @param {string} newName
   * @param {object Transaction} trx
   */
  async renameColumn(tableName, name, newName, trx) {
    await this.getDB()
      .schema.table(tableName, (table) => {
        table.renameColumn(name, newName);
      })
      .transacting(trx);
  }

  /**
   * Drops the column, columnName, in tableName.
   * @param {string} tableName
   * @param {string} columnName
   * @param {object Transaction} trx
   */
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

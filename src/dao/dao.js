import knex from 'knex';
import { DatabaseError, BadRequestError } from '../utils/errors.js';

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
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: 'hb.db',
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
      throw new Error(e.message);
    }
  }

  async findTableByName(name) {
    try {
      const table = await this.getDB()('tablemeta').select('*').where({ name });
      return table;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * Search
   * @param {string} table
   * @param {string} fields
   * @returns {object[]} rows
   * Searches within a table with the given parameter in the database,
   * With the additional parameter, fields, to search for specific rows filtered by specific columns.
   */
  async search(table, fields) {
    try {
      console.log(table, fields, 'SEARCHING');
      const rows = await this.getDB()(table).select('*').where(fields);
      return rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getAll(table) {
    try {
      const rows = await this.getDB()(table).select('*');
      return rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getOne(table, id) {
    try {
      const row = await this.getDB()(table).select('*').where({ id });
      return row;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async createOne(table, newRow) {
    try {
      console.log(table, newRow);
      const createdRow = await this.getDB()(table.name)
        .returning('*')
        .insert(newRow);
      return createdRow;
    } catch (e) {
      if (e.message.slice(0, 11) === 'insert into') {
        throw new BadRequestError();
      } else {
        throw new Error(e.message);
      }
    }
  }

  async updateOne(table, id, newRow) {
    try {
      const updatedRow = await this.getDB()(table.name)
        .returning('*')
        .where({ id })
        .update(newRow);
      return updatedRow;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async deleteOne(table, id) {
    try {
      await this.getDB()(table).where({ id }).del();
    } catch (e) {
      throw new Error(e.message);
    }
  }

  /**
   * addTableMetaData
   * @param {string} table
   * @param {object Transaction} trx
   * @return {object} createdRow
   * A modified version of createOne, but inserts an object
   * Specifically into 'tablemeta'.
   */
  async addTableMetaData(table, trx) {
    const createdRow = await this.getDB()('tablemeta')
      .returning('*')
      .insert({
        id: table.id,
        name: table.name,
        columns: JSON.stringify(table.getColumns()),
      })
      .transacting(trx);
    return createdRow;
  }

  async updateTableMetaData(table, trx) {
    const { id, columns, ...updatePayload } = table;

    const updatedRow = await this.getDB()('tablemeta')
      .returning('*')
      .where({ id })
      .update({
        columns: JSON.stringify(columns),
        ...updatePayload,
      })
      .transacting(trx);

    return updatedRow;
  }

  async deleteTableMetaData(name, trx) {
    await this.getDB()('tablemeta').where({ name }).del().transacting(trx);
  }

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
        table.text('id').primary();
      })
      .transacting(trx);
  }

  async dropTable(name, trx) {
    await this.getDB().schema.dropTable(name).transacting(trx);
  }

  async renameTable(name, newName, trx) {
    await this.getDB().schema.renameTable(name, newName).transacting(trx);
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
        console.log('DROPPING COLUMN', columnName, ' on', tableName);
        table.dropColumn(columnName);
      })
      .transacting(trx);
  }
}

export default DAO;

import knex from 'knex';
import { DatabaseError, BadRequestError } from '../utils/errors.js';

class DAO {
  constructor(dbFile) {
    this.db = this._connect(dbFile);
  }

  _connect(dbFile) {
    return knex({
      client: 'better-sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: 's.db',
      },
    });
  }

  disconnect() {}

  getDB() {
    return this.db;
  }

  async runTransaction(callback) {
    const trx = await this.getDB().transaction();
    try {
      const result = await callback(trx);
      await trx.commit();
      return result;
    } catch (e) {
      await trx.rollback();
      throw new DatabaseError();
    }
  }

  async findTableByName(name) {
    try {
      const table = await this.getDB().raw(
        `SELECT name, type FROM sqlite_master WHERE type='table' AND name='${name}';`
      );
      return table;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getAll(table) {
    try {
      const records = await this.getDB()(table).select('*');
      return records;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getOne(table, id) {
    try {
      const row = await this.getDB()(table).select('*').where({ id });
      return row;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async createOne(table, newRow) {
    try {
      const createdRow = await this.getDB()(table)
        .returning('*')
        .insert(newRow);
      return createdRow;
    } catch (e) {
      if (e.message.slice(0, 11) === 'insert into') {
        throw new BadRequestError();
      } else {
        throw new DatabaseError();
      }
    }
  }

  async updateOne(table, id, newRow) {
    try {
      const updatedRow = await this.getDB()(table)
        .returning('*')
        .where({ id })
        .update(newRow);
      return updatedRow;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async deleteOne(table, id) {
    try {
      await this.getDB()(table).where({ id }).del();
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async addTableMetaData(name, columns, trx) {
    columns = JSON.stringify(columns);
    const createdRow = await this.getDB()('tablemeta')
      .returning('*')
      .insert({ name, columns })
      .transacting(trx);
    return createdRow;
    // return await this.createOne('tablemeta', { name, columns });
  }

  async createTable(name, columns, trx) {
    return await this.getDB()
      .schema.createTable(name, (table) => {
        columns.forEach((column) => {
          if (!table[column.type]) {
            throw new DatabaseError();
          }
          table[column.type](column.name);
        });
      })
      .transacting(trx);
  }
}

export default DAO;

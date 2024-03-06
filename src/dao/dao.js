import knex from "knex";
import { DatabaseError, BadRequestError } from "../utils/errors.js";

class DAO {
  constructor(dbFile) {
    this.db = this._connect(dbFile);
  }

  _connect(dbFile) {
    return knex({
      client: "better-sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "s.db",
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
        `SELECT * FROM tablemeta WHERE name='${name}';`
      );
      return table;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async search(table, searchObj) {
    try {
      const rows = await this.getDB()(table).select("*").where(searchObj);
      return rows;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getAll(table) {
    try {
      const records = await this.getDB()(table).select("*");
      return records;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async getOne(table, id) {
    try {
      const row = await this.getDB()(table).select("*").where({ id });
      return row;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async createOne(table, newRow) {
    try {
      const createdRow = await this.getDB()(table)
        .returning("*")
        .insert(newRow);
      return createdRow;
    } catch (e) {
      if (e.message.slice(0, 11) === "insert into") {
        throw new BadRequestError();
      } else {
        throw new DatabaseError();
      }
    }
  }

  async updateOne(table, id, newRow) {
    try {
      const updatedRow = await this.getDB()(table)
        .returning("*")
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

  async addTableMetaData(table, trx) {
    const createdRow = await this.getDB()("tablemeta")
      .returning("*")
      .insert({ name: table.name, columns: JSON.stringify(table.columns) })
      .transacting(trx);
    return createdRow;
    // return await this.createOne('tablemeta', { name, columns });
  }

  async createTable(table, trx) {
    console.log({ name: table.name, columns: table.columns.columns });
    return await this.getDB()
      .schema.createTable(table.name, (table) => {
        console.log("creating table");
        table.columns.columns.forEach((column) => {
          if (!table[column.type]) {
            console.log("hit error");
            throw new DatabaseError();
          }
          console.log("looping", column.type, column.name);
          table[column.type](column.name);
        });
      })
      .transacting(trx);
  }

  async deleteTableMetaData(name, trx) {
    await this.getDB()("tablemeta").where({ name }).del().transacting(trx);
  }

  async dropTable(name, trx) {
    await this.getDB().schema.dropTable(name).transacting(trx);
  }

  async renameTable(name, newName, trx) {
    await this.getDB().schema.renameTable(name, newName).transacting(trx);
  }

  async addColumn(tableName, columnName, options, trx) {
    await this.getDB()
      .schema // .table(tableName, table => {
      //   table[options.type](columnName)
      // })
      .addColumn(tableName, columnName, options)
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
        table.dropColumn(columnName);
      })
      .transacting(trx);
  }
}

export default DAO;

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
        filename: "hb.db",
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
      throw new Error(e.message);
    }
  }

  async findTableByName(name) {
    try {
      const table = await this.getDB().raw(
        `SELECT * FROM tablemeta WHERE name='${name}';`
      );
      return table;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async search(table, fields) {
    try {
      console.log(table, fields, "SEARCHING");
      const rows = await this.getDB()(table).select("*").where(fields);

      return rows;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getAll(table) {
    try {
      const records = await this.getDB()(table).select("*");
      return records;
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getOne(table, id) {
    try {
      const row = await this.getDB()(table).select("*").where({ id });
      return row;
    } catch (e) {
      throw new Error(e.message);
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
        throw new Error(e.message);
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

  async addTableMetaData(table, trx) {
    const createdRow = await this.getDB()("tablemeta")
      .returning("*")
      .insert({
        id: table.id,
        name: table.name,
        schema: JSON.stringify(table.schema.getColumns()),
      })
      .transacting(trx);
    return createdRow;
    // return await this.createOne('tablemeta', { name, columns });
  }

  async updateTableMetaData(table, trx) {
    const { id, schema, ...updatePayload } = table;

    const updatedRow = await this.getDB()("tablemeta")
      .returning("*")
      .where({ id })
      .update({
        schema: JSON.stringify(schema),
        ...updatePayload,
      })
      .transacting(trx);

    return updatedRow;
  }

  async createTable(table, trx) {
    const name = table.name;
    const columns = table.schema.getColumns();

    return await this.getDB()
      .schema.createTable(name, (table) => {
        columns.forEach((column) => {
          if (!table[column.type]) {
            throw new DatabaseError();
          }
          table[column.type](column.name);
        });
        table.text("id").primary();
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
      .schema.table(tableName, (table) => {
        table[options.type](columnName);
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

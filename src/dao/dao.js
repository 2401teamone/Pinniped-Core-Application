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
}

export default DAO;

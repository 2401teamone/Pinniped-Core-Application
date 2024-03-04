import knex from "knex";

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
      return table[0].name;
    } catch (e) {
      throw new Error(`Error fetching table: ${e.message}`);
    }
  }

  async getAll(table) {
    try {
      const records = await this.getDB()(table).select("*");
      return records;
    } catch (e) {
      throw new Error(`Error fetching records: ${e.message}`);
    }
  }

  async getOne(table, id) {
    try {
      const row = await this.getDB()(table).select("*").where({ id });
      return row;
    } catch (e) {
      throw new Error(`Error fetching record: ${e.message}`);
    }
  }

  async createOne(table, newRow) {
    try {
      const createdRow = await this.getDB()(table)
        .returning("*")
        .insert(newRow);
      return createdRow;
    } catch (e) {
      throw new Error(`Error creating record: ${e.message}`);
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
      throw new Error(`Error updating record: ${e.message}`);
    }
  }

  async deleteOne(table, id) {
    try {
      await this.getDB()(table).where({ id }).del();
    } catch (e) {
      throw new Error(`Failed to delete row: ${e.message}`);
    }
  }
}

export default DAO;

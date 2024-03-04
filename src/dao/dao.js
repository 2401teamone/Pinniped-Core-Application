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

  async getRecords(tableName) {
    try {
      const records = await this.getDB()(tableName).select("*");
      return records;
    } catch (e) {
      throw new Error(`Error fetching records: ${e.message}`);
    }
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
}

export default DAO;

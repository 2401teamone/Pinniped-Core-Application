import knex from "knex";

class DAO {
  constructor(dbFile) {
    this.db = this._connect(dbFile);
  }

  _connect(dbFile) {
    return knex({
      client: "better-sqlite3",
      useNullAsDefault: true,
      debug: true,
      connection: {
        filename: "s.db",
      },
    });
  }

  disconnect() {}

  async getRecords(tableName) {
    try {
      console.log(this.db);
      const records = await this.db(tableName).select("*");
      return records;
    } catch (e) {
      throw new Error(`Error fetching records: ${e.message}`);
    }
  }
}

export default DAO;

import knex from "knex";

class LogDao {
  constructor() {
    this.db = knex({
      client: "better-sqlite3",
      useNullAsDefault: true,
      connection: {
        filename: "pnpd_data/logs.db",
      },
    });
  }

  async createTable() {
    const logsExists = await this.db.schema.hasTable("logs");

    if (!logsExists) {
      await this.db.schema.createTable("logs", (table) => {
        table.specificType("id", "INTEGER PRIMARY KEY");
        table.integer("level");
        table.string("time");
        table.string("hostname");
        table.string("method");
        table.string("url");
        table.json("headers");
        table.integer("statusCode");
        table.integer("responseTime");
      });
    }
  }

  async getLogs() {
    return this.db("logs").select("*");
  }

  async insertLog(log) {
    return this.db("logs")
      .insert(log)
      .catch((err) => console.error(err));
  }

  sqliteStream() {
    return {
      write: (log) => {
        const parsedLog = this.parseLog(log);
        console.log("PARSED LOG", parsedLog);
        if (parsedLog.url === "/api/admin/logs") return;
        this.insertLog(parsedLog);
      },
    };
  }

  parseLog(log) {
    const parsedLog = JSON.parse(log);
    const copy = { ...parsedLog };

    const {
      pid: id,
      level,
      time,
      hostname,
      req: { method, url, headers },
      res: { statusCode },
      responseTime,
    } = copy;

    return {
      id,
      level,
      time,
      hostname,
      method,
      url,
      headers,
      statusCode,
      responseTime,
    };
  }
}

export default LogDao;

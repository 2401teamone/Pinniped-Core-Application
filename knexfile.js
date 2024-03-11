// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./hb.db",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    debug: true,
  },

  staging: {
    client: "better-sqlite3",
    connection: {
      filename: "./hb.db",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    debug: true,
  },

  production: {
    client: "better-sqlite3",
    connection: {
      filename: "./hb.db",
    },
    migrations: {
      tableName: "knex_migrations",
    },
    debug: true,
  },
};

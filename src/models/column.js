import { v4 as uuidv4 } from "uuid";

class Column {
  static COLUMN_MAP = {
    text: {
      sql: "TEXT DEFAULT '' NOT NULL",
      options: {},
    },
    number: {
      sql: "NUMERIC DEFAULT 0 NOT NULL",
      options: {},
    },
    bool: {
      sql: "BOOLEAN DEFAULT false NOT NULL",
      options: {},
    },
    email: {
      sql: "TEXT DEFAULT '' NOT NULL",
      options: {},
    },
    url: {
      sql: "TEXT DEFAULT '' NOT NULL",
      options: {},
    },
    date: {
      sql: "TEXT DEFAULT '' NOT NULL",
      options: {},
    },
    select: {
      sql: "JSON DEFAULT [] NOT NULL",
      options: {},
    },
    relation: {
      sql: "JSON DEFAULT '' NOT NULL",
      options: {},
    },
    json: {
      sql: "JSON DEFAULT NULL",
      options: {},
    },
  };

  static isValidType(type) {
    return Object.keys(Column.COLUMN_MAP).includes(type);
  }

  constructor({ id = uuidv4(), name, type, options = {} }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.options = options;
  }

  generateId() {
    this.id = uuidv4();
  }
}

export default Column;

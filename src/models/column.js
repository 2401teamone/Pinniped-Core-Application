import { v4 as uuidv4 } from 'uuid';

class TextOptions {
  constructor({ minLength = 0, maxLength = 255 }) {
    this.minLength = minLength;
    this.maxLength = maxLength;
  }

  validate(value) {
    return (
      typeof value === 'string' &&
      value.length >= this.minLength &&
      value.length <= this.maxLength
    );
  }
}

class NumberOptions {
  constructor({ min = 0, max = 30 }) {
    this.min = min;
    this.max = max;
  }

  validate(value) {
    if (typeof value !== 'number') return false;
    if (this.min && value < this.min) return false;
    if (this.max && value > this.max) return false;
    return true;
  }
}

class BoolOptions {
  constructor({}) {}

  validate(value) {
    return typeof value === 'boolean';
  }
}

class DateOptions {
  constructor() {}
  validate(value) {}
}

class Column {
  static COLUMN_MAP = {
    text: {
      sql: "TEXT DEFAULT '' NOT NULL",
      options: TextOptions,
    },
    number: {
      sql: 'NUMERIC DEFAULT 0 NOT NULL',
      options: NumberOptions,
    },
    bool: {
      sql: 'BOOLEAN DEFAULT false NOT NULL',
      options: BoolOptions,
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
      options: DateOptions,
    },
    select: {
      sql: 'JSON DEFAULT [] NOT NULL',
      options: {},
    },
    relation: {
      sql: "JSON DEFAULT '' NOT NULL",
      options: {},
    },
    json: {
      sql: 'JSON DEFAULT NULL',
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
    this.options = new Column.COLUMN_MAP[type].options(options);
  }

  generateId() {
    this.id = uuidv4();
  }

  getOptions(optionsShape) {
    for (let key in optionsShape) {
      if (!this.options.hasOwnProperty(key)) {
        return null;
      }
    }
    return this.options;
  }
}

export default Column;

import Columns from './columns.js';

class Table {
  constructor({ id, name, columns, rules = {} }) {
    this.name = name;
    this.id = id;
    // this.type = type;

    this.schema = new Columns(columns);

    this.getAllRule = rules.getAllRule;
    this.getOneRule = rules.getOneRule;
    this.createRule = rules.createRule;
    this.updateRule = rules.updateRule;
    this.deleteRule = rules.deleteRule;
  }
}

export default Table;

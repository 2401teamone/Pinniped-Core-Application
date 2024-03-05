class Table {
  constructor({ name, type, cols }) {
    this.name = name;
    this.type = type;

    this.getAllRule = "";
    this.getOneRule = "";
    this.createRule = "";
    this.updateRule = "";
    this.deleteRule = "";
  }
}

export default Table;

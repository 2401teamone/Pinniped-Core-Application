import Column from "./column.js";

class Schema {
  constructor(schema) {
    console.log(schema, "in schema class");
    this.columns = schema.map((column) => new Column({ ...column }));
  }

  getColumns() {
    return this.columns;
  }

  initializeIds() {
    this.columns.forEach((column) => column.initializeId());
  }

  getColumnById(id) {
    let foundColumn = this.columns.find((column) => column.id === id);
    if (!foundColumn) return null;
    return foundColumn;
  }

  stringifyColumns() {
    return JSON.stringify(this.columns);
  }
}

export default Schema;

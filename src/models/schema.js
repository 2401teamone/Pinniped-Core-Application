import Column from "./column.js";

class Schema {
  constructor(schema) {
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

  stringifyToJson() {
    return JSON.stringify(this.columns);
  }
}

export default Schema;

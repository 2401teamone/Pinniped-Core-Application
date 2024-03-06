import Column from "./column.js";

class Columns {
  constructor(columns) {
    this.columns = columns.map((column) => new Column(column));
  }
}

export default Columns;

export default class ResponseData {
  constructor(table, rows, res) {
    this.table = table;
    this.rows = rows;
    this.res = res;
  }

  responseSent() {
    return this.res.finished
  }

  formatAllResponse() {
    return {
      table: {
        id: this.table.id,
        name: this.table.name,
      },
      rows: this.rows,
    }
  }

  formatOneResponse() {
    return {
      table: {
        id: this.table.id,
        name: this.table.name,
      },
      row: this.rows[0],
    }
  }
}


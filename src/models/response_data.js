export default class ResponseData {
  constructor(table, rows, res, req) {
    this.table = table;
    this.rows = rows;
    this.res = res;
    this.req = req;
  }

  responseSent() {
    return this.res.finished;
  }

  formatAllResponse() {
    return {
      table: {
        id: this.table.id,
        name: this.table.name,
      },
      rows: this.rows,
    };
  }

  formatOneResponse() {
    return {
      table: {
        id: this.table.id,
        name: this.table.name,
      },
      row: this.rows[0],
    };
  }
}

import initApi from "../api/initApi.js";
import DAO from "../dao/dao.js";

class HB {
  static createApp(config) {
    return new HB(config);
  }

  constructor(config) {
    this.DAO = new DAO();
  }

  // onGetAllRecords() {}
  // onGetRecord() {}

  start(port) {
    const server = initApi(this);
    server.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  }
}

export default HB;

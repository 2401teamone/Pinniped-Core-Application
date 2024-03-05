import initApi from "../api/init_api.js";
import DAO from "../dao/dao.js";
import EventEmitter from "events";

class HB {
  static createApp(config) {
    return new HB(config);
  }

  constructor(config) {
    this.DAO = new DAO();
    this.events = new EventEmitter();
  }

  // useful for: enriching rows with additional properties; adding custom validation; running custom data aggregation operations and adding to res
  /**
   * Adds an event handler that listens for the event of "GET_ALL_ROWS".
   * The callback passed to add is executed when the event is heard.
   * @input String(s)
   * @output Object Event Handler
   */
  onGetAllRows(...tables) {
    const EVENT_NAME = "GET_ALL_ROWS";
    return {
      add: (handler) => {
        this.events.on(EVENT_NAME, (event) => {
          if (
            (!tables.length || tables.includes(event.table)) &&
            !event.res.finished
          )
            handler(event);
        });
      },
      // should this trigger be exposed to developers? Alternative would be only allow backend to trigger
      trigger: (event) => {
        this.events.emit(EVENT_NAME, event);
      },
    };
  }

  onGetOneRow() {}

  getDAO() {
    return this.DAO;
  }

  start(port) {
    const server = initApi(this);
    server.listen(port, () => {
      console.log(`App listening at http://localhost:${port}`);
    });
  }
}

export default HB;

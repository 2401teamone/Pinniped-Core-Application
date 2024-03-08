import initApi from '../api/init_api.js';
import DAO from '../dao/dao.js';
import EventEmitter from 'events';
import { InvalidCustomRouteError } from '../utils/errors.js';

class HB {
  static createApp(config) {
    return new HB(config);
  }

  constructor(config) {
    this.DAO = new DAO();
    this.events = new EventEmitter();
    this.customRoutes = [];
  }

  addRoute(method, path, handler) {
    const VALID_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
    if (!VALID_METHODS.includes(method)) {
      throw new InvalidCustomRouteError(
        `Please provide one of the valid methods: ${VALID_METHODS}`
      );
    }
    if (path.startsWith('/api'))
      throw new InvalidCustomRouteError(
        "Cannot use '/api' as the beginning of your route, as it is saved for pre-generated routes."
      );
    if (typeof handler !== 'function')
      throw new InvalidCustomRouteError(
        'Please provide a function as your handler.'
      );

    this.customRoutes.push({ method, path, handler });
  }

  // useful for: enriching rows with additional properties; adding custom validation; running custom data aggregation operations and adding to res
  /**
   * getAllRows
   * Returns an object that adds an event handler and trigger events of the type: "GET_ALL_ROWS".
   * The callback passed to add is executed when the event is heard.
   * @param {...string} tables
   * @returns {object}
   */
  onGetAllRows(...tables) {
    const EVENT_NAME = 'GET_ALL_ROWS';
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

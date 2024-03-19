import initApi from "../api/init_api.js";
import DAO from "../dao/dao.js";
import EventEmitter from "events";
import { InvalidCustomRouteError } from "../utils/errors.js";

/**
 * HB (HomeBase) Class
 * Runs the application of the backend.
 * Offers extensibility of custom routes.
 */
class Pinniped {
  static createApp(config) {
    return new Pinniped(config);
  }

  constructor(config) {
    this.DAO = new DAO();
    this.events = new EventEmitter();
    this.customRoutes = [];
  }
  /**
   * Allows developers to add their own route
   * That can receive a HTTP request to the given path.
   * When that path is reached with the appropriate method,
   * It'll invoke the function, handler.
   * @param {string} method
   * @param {string} path
   * @param {function} handler
   */
  addRoute(method, path, handler) {
    const VALID_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!VALID_METHODS.includes(method)) {
      throw new InvalidCustomRouteError(
        `Please provide one of the valid methods: ${VALID_METHODS}`
      );
    }
    if (path.startsWith("/api"))
      throw new InvalidCustomRouteError(
        "Cannot use '/api' as the beginning of your route, as it is saved for pre-generated routes."
      );
    if (typeof handler !== "function")
      throw new InvalidCustomRouteError(
        "Please provide a function as your handler."
      );

    this.customRoutes.push({ method, path, handler });
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "GET_ALL_ROWS".
   * The callback passed to add is executed when the event is heard on the passed in tables.
   * @param {...string} tables
   * @returns {object}
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

  /**
   * Returns the app's DAO instance.
   * @returns {object DAO}
   */
  getDAO() {
    return this.DAO;
  }

  start(port) {
    const server = initApi(this);
    server.listen(port, () => {
      console.log(`Admin UI available at http://localhost:${port}/_`);
      console.log(`App listening at http://localhost:${port}`);
    });
  }
}

export const MigrationDao = DAO;
export const pnpd = Pinniped.createApp;

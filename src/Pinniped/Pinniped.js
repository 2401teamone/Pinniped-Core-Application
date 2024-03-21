import initApi from "../api/init_api.js";
import DAO from "../dao/dao.js";
import EventEmitter from "events";
import registerProcessListeners from "../utils/register_process_listeners.js";
import { InvalidCustomRouteError } from "../utils/errors.js";
import Table from "../models/table.js";
import PinnipedEvent from "../models/event.js";

/**
 * Pinniped Class
 * Runs the application of the backend.
 * Offers extensibility of custom routes.
 */
class Pinniped {
  static createApp(config) {
    return new Pinniped(config);
  }

  constructor(config) {
    this.DAO = new DAO();
    this.emitter = new EventEmitter();
    this.customRoutes = [];
    this.seedDatabase();
  }

  /**
   * Seeds the database with the necessary tables.
   * If the tables do not exist, it creates them.
   * If the tables do exist, it does nothing.
   * If the tables are not created, it throws an error.
   * @returns {Promise}
   * @throws {Error}
   */
  async seedDatabase() {
    try {
      const usersExists = await this.getDAO().tableExists("users");
      const _adminExists = await this.getDAO().tableExists("_admins");
      const tablemetaExists = await this.getDAO().tableExists("tablemeta");

      if (!tablemetaExists) {
        await this.getDAO().createTablemeta();
      }

      if (!usersExists) {
        const users = new Table({
          name: "users",
          columns: [
            { name: "username", type: "text" },
            { name: "password", type: "text" },
            { name: "role", type: "text" },
          ],
        });
        await users.create();
      }

      if (!_adminExists) {
        const _admins = new Table({
          name: "_admins",
          columns: [
            { name: "username", type: "text" },
            { name: "password", type: "text" },
            { name: "role", type: "text" },
          ],
        });
        await _admins.create();
      }
    } catch (error) {
      console.error(error);
    }
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
    return new PinnipedEvent(this.emitter, "GET_ALL_ROWS", tables);
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "GET_ONE_ROW".
   * The callback passed to add is executed when the event is heard on the passed in tables.
   * @param {...string} tables
   * @returns {object} PinnipedEvent
   */
  onGetOneRow(...tables) {
    return new PinnipedEvent(this.emitter, "GET_ONE_ROW", tables);
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "CREATE_ONE_ROW".
   * The callback passed to add is executed when the event is heard on the passed in tables.
   * @param {...string} tables
   * @returns {object} PinnipedEvent
   */
  onCreateOneRow(...tables) {
    return new PinnipedEvent(this.emitter, "CREATE_ONE_ROW", tables);
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "UPDATE_ONE_ROW".
   * The callback passed to add is executed when the event is heard on the passed in tables.
   * @param {...string} tables
   * @returns {object} PinnipedEvent
   */
  onUpdateOneRow(...tables) {
    return new PinnipedEvent(this.emitter, "UPDATE_ONE_ROW", tables);
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "DELETE_ONE_ROW".
   * The callback passed to add is executed when the event is heard on the passed in tables.
   * @param {...string} tables
   * @returns {object} PinnipedEvent
   */
  onDeleteOneRow(...tables) {
    return new PinnipedEvent(this.emitter, "DELETE_ONE_ROW", tables);
  }

  /**
   * Returns an object that adds an event handler and trigger events of the type: "BACKUP_DATABASE".
   * The callback passed to add is executed when the event is heard.
   * @returns {object} PinnipedEvent
   */
  onBackupDatabase() {
    return new PinnipedEvent(this.emitter, "BACKUP_DATABASE");
  }

  /**
   * Returns the app's DAO instance.
   * @returns {object DAO}
   */
  getDAO() {
    return this.DAO;
  }

  /**
   * Starts the server on the given port, and registers process event handlers.
   * @param {number} port
   */

  start(port) {
    registerProcessListeners(this);

    const server = initApi(this);

    server.listen(port, () => {
      console.log(`\nServer started at: http://localhost:${port}`);
      console.log(`├─ REST API: http://localhost:${port}/api`);
      console.log(`└─ Admin UI: http://localhost:${port}/_/\n`);
    });
  }
}

export const MigrationDao = DAO;
export const pnpd = Pinniped.createApp;

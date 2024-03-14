import { Router } from "express";
import catchError from "../utils/catch_error.js";
import Database from "better-sqlite3";
import adminOnly from "./middleware/admin_only.js";

export default function generateAdminRouter(app) {
  const router = Router();
  const adminAPI = new AdminAPI(app);

  // router.use(adminOnly());
  router.get("/export", catchError(adminAPI.exportHandler()));
  router.post("/import", catchError(adminAPI.importHandler()));

  return router;
}

class AdminAPI {
  constructor(app) {
    this.app = app;
    this.db = this.openConnection();
  }

  async openConnection() {
    // assures that the better-sqlite3 connection will connect to the app database
    await this.app.getDAO().createOne("hiithere", { name: "something" });
    let knex = this.app.getDAO().getDB();
    // creates better-sqlite3 connection
    // let result = await knex.client.acquireConnection();
    // console.log(result);
    // console.log(result2);
    console.log("this is the knex object: ", knex.context.client.pool);
    setTimeout(() => {
      console.log(
        "this is the knex object after some time: ",
        knex.context.client.pool
      );
    }, 40000);
    // knex.context.client.pool.used[0].resource < this is the database connection from the pool
    // console.log(dbName);
    // return dbName;
    // return new Database(dbName);
  }
  exportHandler() {
    return async (req, res, next) => {
      // this.db().prepare("DROP TABLE IF EXISTS hiithere;").run();
      console.log("backing up the db...");
      res.sendStatus(200);
    };
  }

  importHandler() {
    return async (req, res, next) => {
      console.log("replacing your database with target database...");
      res.sendStatus(201);
    };
  }
}

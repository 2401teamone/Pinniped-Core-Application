import { Router } from "express";
import catchError from "../utils/catch_error.js";
import { AuthenticationError } from "../utils/errors.js";
import bcrypt from "bcrypt";

export default function generateAuthRouter(app) {
  const router = Router();
  const authApi = new AuthApi(app);

  router.get("/", (req, res, next) => {
    console.log("req.session: ", req.session);
    res.send(req.session);
  });

  //register a user
  router.post("/register", catchError(authApi.registerHandler()));

  //Login a user

  //Logout a user

  return router;
}

class AuthApi {
  constructor(app) {
    this.app = app;
  }

  getCurrentUser() {
    return async (req, res, next) => {};
  }

  getSessionsHandler() {
    return async (req, res, next) => {};
  }

  registerHandler() {
    return async (req, res, next) => {
      const { username, password } = req.body;

      //Check if username exists
      const existingUser = await this.app
        .getDAO()
        .search("users", { username });

      if (existingUser.length) {
        throw new AuthenticationError("Username not available");
      }

      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      //insert a new user into the database
      const createdUser = await this.app
        .getDAO()
        .createOne("users", { username, password: hashedPassword });

      console.log("User created :", createdUser[0]);
      res.status(201).json({ username });
    };
  }

  loginHandler() {
    return async (req, res, next) => {};
  }

  logoutHandler() {
    return async (req, res, next) => {};
  }
}

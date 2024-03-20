import bcrypt from "bcrypt";
import { Router } from "express";
import catchError from "../../utils/catch_error.js";
import { AuthenticationError } from "../../utils/errors.js";

/**
 * Creates an Express Router object
 * That sets middleware and handlers for
 * The designated authentication routes.
 * @param {object HB} app
 * @returns {object Router} router
 */
export default function generateAuthRouter(app) {
  const router = Router();
  const authApi = new AuthApi(app);

  router.get("/", catchError(authApi.getSessionHandler())); // Just for testing

  router.post("/register", catchError(authApi.registerHandler()));
  router.post("/login", catchError(authApi.loginHandler()));
  router.post("/admin/register", catchError(authApi.registerAdminHandler()));
  router.post("/admin/login", catchError(authApi.loginAdminHandler()));
  router.post("/logout", catchError(authApi.logoutHandler()));
  router.get("/admin/registered", catchError(authApi.checkIfAdminHasRegistered()));

  return router;
}

class AuthApi {
  constructor(app) {
    this.app = app;
  }

  getCurrentUser() {
    return async (req, res, next) => {};
  }

  getSessionHandler() {
    return (req, res, next) => {
      console.log("req.session: ", req.session);
      res.status(200).json({ user: req.session.user });
    };
  }

  /**
   * Returns a handler function that creates a new user.
   * It checks if the username already exists.
   * And if not, then creates the user and saves the credentials in the 'users' table.
   * @returns {function}
   */
  registerHandler() {
    return async (req, res, next) => {
      const { username, password } = req.body;

      // Checks if 'username' exists in 'users'
      const existingUser = await this.app
        .getDAO()
        .search("users", { username });
      if (existingUser.length)
        throw new AuthenticationError("Username not available.");

      // Hashes the inputted password and inserts this user's credentials into the 'users' table.
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await this.app
        .getDAO()
        .createOne("users", { username, password: hashedPassword });

      console.log("User created :", createdUser[0]);
      res.status(201).json({ username });
    };
  }

  /**
   * Returns a handler that adds an admin user to the '_admin' table.
   * It checks if the username already exists, and if not, adds the user to the '_admin' table.
   * @returns {function}
   */
  registerAdminHandler() {
    return async (req, res, next) => {
      const { username, password } = req.body;

      // Checks if 'username' exists in 'users'.
      const existingAdmin = await this.app
        .getDAO()
        .search("_admins", { username });
      if (existingAdmin.length)
        throw new AuthenticationError("Username not available");

      // Hashes the inputted password and inserts this admin's credentials into the '_admin' table.
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdAdmin = await this.app
        .getDAO()
        .createOne("_admins", { username, password: hashedPassword });

      console.log("Admin created :", createdAdmin[0]);
      res.status(201).json({ username });
    };
  }

  /**
   * Returns a handler that logs in a user.
   * It checks if the credentials exist:
   *  If the username is found in 'users',
   *  And if the inputted password hashed matches the hashed password in 'users'.
   * If the credentials match, then the user's session is established.
   * @returns {function}
   */
  loginHandler() {
    return async (req, res, next) => {
      const { username, password } = req.body;

      console.log("Username Sent: ", username);

      // Checks if 'username' exists in 'users'.
      const existingUser = await this.app
        .getDAO()
        .search("users", { username });
      if (!existingUser.length) throw new AuthenticationError();

      // Hashes the inputted password, and sees if it's equal to the hashed password in 'users'.
      const match = await bcrypt.compare(password, existingUser[0].password);
      if (!match) throw new AuthenticationError();

      // Sets the session's user to the found user.
      req.session.user = existingUser[0];
      delete req.session.user.password;

      console.log("Logged in user: ", req.session.user);
      res.status(200).json({ message: "User logged in successfully." });
    };
  }

  /**
   * Returns a handler that logs in an admin.
   * It checks if the credentials for the admin exists in '_admin',
   * And checks if the credentials inputted match the saved admin in '_admin'.
   * If the credentials match, then the admin's session is established.
   * @returns {function}
   */
  loginAdminHandler() {
    return async (req, res, next) => {
      const { username, password } = req.body;

      // Check if the 'username' exists in '_admins'.
      const existingAdmin = await this.app
        .getDAO()
        .search("_admins", { username });
      if (!existingAdmin.length) throw new AuthenticationError();

      // Hashes the inputted password and compares it with the hashed password in '_admins'.
      const match = await bcrypt.compare(password, existingAdmin[0].password);
      if (!match) throw new AuthenticationError();

      // Sets the session's user to the found admin.
      req.session.user = existingAdmin[0];
      delete req.session.user.password;

      console.log("logged in admin: ", req.session.user);
      res.status(200).json({ admin: req.session.user });
    };
  }

  /**
   * Returns a handler that logs out the current session's user.
   * @returns {function}
   */
  logoutHandler() {
    return async (req, res, next) => {
      console.log("Logging out user: ", req.session.user);
      delete req.session.user;
      res.status(200).json({ message: "User logged out." });
    };
  }

  checkIfAdminHasRegistered() {
    return async (req, res, next) => {
      const existingAdmin = await this.app.getDAO().getAll('_admins');
      if (existingAdmin.length) {
        res.status(200).json({ registered: true });
      } else {
        res.status(200).json({ registered: false });
      }
    };
  }
}

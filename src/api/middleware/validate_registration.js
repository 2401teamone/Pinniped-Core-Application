import catchError from "../../utils/catch_error.js";
import { BadRequestError, AuthenticationError } from "../../utils/errors.js";

export default function validateRegistration(app) {
  return catchError(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
      throw new BadRequestError("Username cannot be empty.");
    }
    const existingUser = await app.getDAO().search("users", { username });
    if (existingUser.length)
      throw new AuthenticationError("Username not available.");

    if (password.length < 10) {
      throw new BadRequestError("Password must be at least 10 characters");
    }
    if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      throw new BadRequestError(
        "Password must contain at least one number and one special character"
      );
    }

    next();
  });
}

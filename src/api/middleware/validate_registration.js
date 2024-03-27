import { BadRequestError } from "../../utils/errors.js";

export default function validateRegistration() {
  return (req, res, next) => {
    const { username, password } = req.body;

    if (!username) {
      throw new BadRequestError("Username cannot be empty.");
    } else if (password.length < 10) {
      throw new BadRequestError("Password must be at least 10 characters");
    } else if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      throw new BadRequestError(
        "Password must contain at least one number and one special character"
      );
    }

    next();
  };
}

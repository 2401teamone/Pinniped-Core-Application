import catchError from "../../utils/catch_error.js";
import { ForbiddenError } from "../../utils/errors.js";

export default function adminOnly() {
  return catchError(async (req, res, next) => {
    if (!req.session.user || req.session.user.role !== "admin") {
      throw new ForbiddenError();
    }
    next();
  });
}

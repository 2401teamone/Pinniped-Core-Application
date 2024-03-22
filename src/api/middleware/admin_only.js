import catchError from "../../utils/catch_error.js";
import { ForbiddenError, UnauthenticatedError } from "../../utils/errors.js";

/**
 *  Middleware that throws an unauthenticated error if the user is not logged in
 *  or a forbidden error if the user is not an admin
 *  @returns {function} middleware
 */
export default function adminOnly() {
  return catchError(async (req, res, next) => {
    if (!req.session.user) throw new UnauthenticatedError();

    if (req.session.user.role !== "admin") throw new ForbiddenError();

    next();
  });
}

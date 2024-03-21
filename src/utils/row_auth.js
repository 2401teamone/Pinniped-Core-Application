import { ForbiddenError } from "./errors.js";

/**
 * Throws a ForbiddenError if the current user does not have access to the
 * row based upon the table's API rules and the user's role.
 * @param {object} user - The user object from req.session
 * @param {object} res - The express response object.
 */
export function creatorAuthCheck(user, res, row) {
  const { table, apiRule } = res.locals;

  if (table[apiRule] !== "creator" || user.role === "admin") return;

  if (row[0].creatorId !== user.id) throw new ForbiddenError();
}

/**
 * Returns all rows that the current user has access to, based upon
 * the table's API rules and the user's role.
 * @param {object} user - The user object from req.session
 * @param {object} res - The express response object.
 * @param {array} rows - The rows to filter.
 * @returns {array} - The filtered rows.
 */
export function creatorAuthFilter(user, res, rows) {
  const { table, apiRule } = res.locals;

  if (table[apiRule] !== "creator" || user.role === "admin") return rows;

  return rows.filter((row) => row.creatorId === user.id);
}

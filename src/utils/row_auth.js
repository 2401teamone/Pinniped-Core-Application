import { ForbiddenError } from "./errors.js";

/**
 * Throws a ForbiddenError if the current user does not have access to the
 * row based upon the table's API rules and the user's role.
 * @param {object} user - The user object from req.session
 * @param {string} apiRule - The API rule for the table.
 * @param {array} row - The row to check.
 */
export function creatorAuthCheck(user, apiRule, row) {
  if (apiRule !== "creator" || user.role === "admin") return;

  if (row[0].creatorId !== user.id) throw new ForbiddenError();
}

/**
 * Returns all rows that the current user has access to, based upon
 * the table's API rules and the user's role.
 * @param {object} user - The user object from req.session
 * @param {string} apiRule - The API rule for the table.
 * @param {array} rows - The rows to filter.
 * @returns {array} - The filtered rows.
 */
export function creatorAuthFilter(user, apiRule, rows) {
  if (apiRule !== "creator" || user.role === "admin") return rows;

  return rows.filter((row) => row.creatorId === user.id);
}

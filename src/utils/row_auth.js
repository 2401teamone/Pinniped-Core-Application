import { ForbiddenError } from "./errors.js";

export function creatorAuthCheck(user, res, row) {
  const { table, apiRule } = res.locals;

  if (user.role === "admin") return;

  if (table[apiRule] === "creator" && row[0].creatorId !== user.id) {
    throw new ForbiddenError();
  }
}

export function creatorAuthFilter(user, res, rows) {
  const { table, apiRule } = res.locals;

  if (user.role === "admin") return rows;

  if (table[apiRule] === "creator") {
    return rows.filter((row) => row.creatorId === user.id);
  }

  return rows;
}

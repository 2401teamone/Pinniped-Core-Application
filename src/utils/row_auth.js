import { ForbiddenError } from "./errors.js";

export default function creatorAuthCheck(user, res, row) {
  const { table, apiRule } = res.locals;

  if (user.role === "admin") return;

  if (table[apiRule] === "creator" && row[0].userId != user.id) {
    throw new ForbiddenError();
  }
}

import { TableNotFoundError } from "../../utils/errors.js";
import catchError from "../../utils/catch_error.js";

export default function loadTableContext(app) {
  return catchError(async (req, res, next) => {
    const { table } = req.params;
    const foundTable = await app.getDAO().findTableByName(table);
    if (!foundTable.length) throw new TableNotFoundError(table);
    res.locals.table = foundTable[0].name;
    next();
  });
}

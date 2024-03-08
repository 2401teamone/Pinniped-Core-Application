import { TableNotFoundError } from "../../utils/errors.js";
import catchError from "../../utils/catch_error.js";
import Table from "../../models/table.js";

export default function loadTableContext(app) {
  return catchError(async (req, res, next) => {
    const { tableId } = req.params;
    // find table in tablemeta
    let foundTable = await app.getDAO().findTableById(tableId);
    if (!foundTable.length) throw new TableNotFoundError(tableId);
    foundTable = foundTable[0];

    // create new table instance
    const tableContext = new Table(foundTable);

    // mount table instance to res.locals
    res.locals.table = tableContext;
    next();
  });
}

export default function loadTableContext(app) {
  return async (req, res, next) => {
    const { table } = req.params;
    try {
      res.locals.table = await app.getDAO().findTableByName(table);
      next();
    } catch (e) {
      // if no table, throw error
      throw new Error(`Table not found`);
    }
  };
}

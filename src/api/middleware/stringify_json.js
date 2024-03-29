import Column from "../../models/column.js";

export default function stringifyColumns() {
  return (req, res, next) => {
    const { table } = res.locals;

    for (let key in req.body) {
      let column = table.getColumnByName(key);
      if (Column.COLUMN_MAP[column.type].isJson) {
        req.body[key] = JSON.stringify(req.body[key]);
      }
    }
    next();
  };
}

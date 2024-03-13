import Column from '../../models/column.js';

function validateRecord() {
  return (req, res, next) => {
    const { table } = res.locals;

    for (let key in req.body) {
      console.log('key', key, req.body[key]);
      let column = table.getColumnByName(key);
      if (!column) throw new Error('Column does not exist.');
      let [isValid, errorMessage] = column.options.validate(req.body[key]);
      if (!isValid) throw new Error(errorMessage);

      if (Column.COLUMN_MAP[column.type].isJson) {
        req.body[key] = JSON.stringify(req.body[key]);
      }
    }
    next();
  };
}

export default validateRecord;

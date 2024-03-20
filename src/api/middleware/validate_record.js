import {BadRequestError} from '../../utils/errors.js';

function validateRecord() {
  return (req, res, next) => {
    const { table } = res.locals;
    
    for (let key in req.body) {
      let column = table.getColumnByName(key);
      if (!column) throw new BadRequestError("Column does not exist in the schema.");
      let [isValid, errorMessage] = column.options.validate(req.body[key]);
      if (!isValid) throw new BadRequestError(errorMessage);
    }
    next();
  };
}

export default validateRecord;

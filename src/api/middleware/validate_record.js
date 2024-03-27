import { BadRequestError } from "../../utils/errors.js";

export const validatePostMeetsRequiredFields = () => {
  return (req, res, next) => {
    const { table } = res.locals;

    const requiredColumns = table
      .getColumns()
      .filter((column) => column.required);
    for (let column of requiredColumns) {
      if (!req.body[column.name]) {
        throw new BadRequestError(`Column ${column.name} is required.`);
      }
    }

    next();
  };
};

export const validatePatchMeetsRequiredFields = () => {
  return (req, res, next) => {
    const { table } = res.locals;

    for (let key in req.body) {
      let val = req.body[key];
      if (!val && table.getColumnByName(key).required) {
        throw new BadRequestError(`Column ${key} is required.`);
      }
    }

    next();
  };
};

export const validateRequestMeetsCustomValidation = () => {
  return (req, res, next) => {
    const { table } = res.locals;

    for (let key in req.body) {
      let column = table.getColumnByName(key);
      if (!column)
        throw new BadRequestError("Column does not exist in the schema.");
      let [isValid, errorMessage] = column.options.validate(req.body[key]);
      if (!isValid) throw new BadRequestError(errorMessage);
    }
    next();
  };
};

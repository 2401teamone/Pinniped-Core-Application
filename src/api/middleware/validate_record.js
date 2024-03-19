function validateRecord() {
  return (req, res, next) => {
    const { table } = res.locals;

    for (let key in req.body) {
      let column = table.getColumnByName(key);
      if (!column) throw new Error("Column does not exist.");
      let [isValid, errorMessage] = column.options.validate(req.body[key]);
      if (!isValid) throw new Error(errorMessage);
    }
    next();
  };
}

export default validateRecord;

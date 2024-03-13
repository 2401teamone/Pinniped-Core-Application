import xss from "xss";
import catchError from "../../utils/catch_error.js";

//recursively search through the object and sanitize any nested string values
const sanitizeObject = (obj) => {
  for (let key in obj) {
    if (typeof obj[key] === "string") {
      if (obj[key] !== xss(obj[key])) {
        console.log("XSS ATTACK DETECTED. Sanitizing input.");
      }
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]);
    }
  }
};

export default function sanitize(app) {
  return catchError(async (req, res, next) => {
    sanitizeObject(req.body);
    next();
  });
}

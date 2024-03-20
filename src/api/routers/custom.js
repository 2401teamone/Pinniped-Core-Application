import { Router } from "express";
import catchError from "../../utils/catch_error.js";

export default function generateCustomRouter(app) {
  const router = Router();

  app.customRoutes.forEach(({ method, path, handler }) => {
    router[method.toLowerCase()](path, catchError(handler));
  });

  return router;
}

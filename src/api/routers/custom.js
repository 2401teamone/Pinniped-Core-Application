import { Router } from "express";
import catchError from "../../utils/catch_error.js";
import customRouteEvent from "../middleware/custom_route_events.js";

export default function generateCustomRouter(app) {
  const router = Router();

  app.customRoutes.forEach(({ method, path, handler }) => {
    router[method.toLowerCase()](
      path,
      customRouteEvent(app),
      catchError(handler)
    );
  });

  return router;
}

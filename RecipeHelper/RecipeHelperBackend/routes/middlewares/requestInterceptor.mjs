import { logger } from "../../shared/logger.mjs";

function requestInterceptor(req, res, next) {
  const { method, path, body, query, params } = req;

  console.log("---- Incoming Request ----");
  console.log("Path:", path);
  console.log("Method:", method);
  if (Object.keys(params).length > 0) console.log("Params:", params);
  if (Object.keys(query).length > 0) console.log("Query:", query);
  if (Object.keys(body).length > 0) console.log("Body:", body);
  console.log("--------------------------");

  next(); // Pass control to the next middleware
}

export { requestInterceptor };

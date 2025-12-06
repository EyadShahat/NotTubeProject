import { ZodError } from "zod";

export function notFound(_req, res, _next) {
  res.status(404).json({ error: "Not found" });
}

export function errorHandler(err, _req, res, _next) { // eslint-disable-line no-unused-vars
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message || "Request failed" });
  }

  res.status(500).json({ error: "Internal server error" });
}

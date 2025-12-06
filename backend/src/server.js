import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import flagRoutes from "./routes/flags.js";
import uploadRoutes from "./routes/upload.js";
import userRoutes from "./routes/users.js";
import { errorHandler, notFound } from "./middleware/error.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const clientOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(cors({ origin: clientOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/flags", flagRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);

// fallbacks
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

start();

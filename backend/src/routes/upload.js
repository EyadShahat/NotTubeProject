import express from "express";
import multer from "multer";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { authRequired } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Ensure .env is loaded even if server dotenv runs after imports
dotenv.config();

const router = express.Router();

const storage = multer.memoryStorage();
// Allow up to 500MB uploads (adjust if your hosting allows larger)
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const supabaseBucket = process.env.SUPABASE_BUCKET || "videos";

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!supabase) {
  console.warn("Supabase is not configured. Upload endpoint will fail until SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.");
}

const bodySchema = z.object({
  path: z.string().optional(),
});

router.post("/", authRequired, upload.single("file"), asyncHandler(async (req, res) => {
  if (!supabase) return res.status(500).json({ error: "Supabase not configured" });
  if (!req.file) return res.status(400).json({ error: "Missing file" });

  bodySchema.parse(req.body || {});

  const ext = (req.file.originalname.split(".").pop() || "mp4").toLowerCase();
  const key = req.body.path || `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(supabaseBucket)
    .upload(key, req.file.buffer, {
      contentType: req.file.mimetype || "video/mp4",
      upsert: true,
    });

  if (error) {
    console.error("Supabase upload error", error);
    return res.status(500).json({ error: "Upload failed", details: error.message || String(error) });
  }

  // If bucket is public, this is a public URL. Otherwise you need signed URLs.
  const { data: publicData } = supabase.storage.from(supabaseBucket).getPublicUrl(data.path);
  const url = publicData?.publicUrl;

  res.status(201).json({ url, path: data.path });
}));

export default router;

// backend/server.js
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// ---------------- PATH SETUP ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- CLOUDINARY ----------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ---------------- SUPABASE ----------------
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------- MULTER ----------------
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// ---------------- API ROUTES ----------------

// GET all images
app.get("/api/images", async (req, res) => {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

// POST upload
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { name, email, reward, currency } = req.body;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Upload buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "doppelganster" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Store metadata in Supabase and return the inserted row
    const { data, error } = await supabase
      .from("images")
      .insert([
        {
          name: name || "Anonymous",
          email: email || "",
          reward: reward ? Number(reward) : 0,
          currency: currency || "₹",
          url: result.secure_url,
        },
      ])
      .select(); // ✅ ensures Supabase returns the inserted row

    if (error) throw error;

    return res.json(data[0]); // ✅ no more null error
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SERVE FRONTEND ----------------
app.use(express.static(path.join(__dirname, "public")));

// Fallback for SPA or unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Test Supabase connection on server start
(async () => {
  const { data, error } = await supabase
    .from("images") // change this to your real table name
    .select("*")
    .limit(1);

  if (error) {
    console.error("❌ Supabase test failed:", error.message);
  } else {
    console.log("✅ Supabase connection OK. Sample data:", data);
  }
})();

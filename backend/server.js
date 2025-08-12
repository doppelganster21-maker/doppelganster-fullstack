// import express from 'express';
// import multer from 'multer';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import mongoose from 'mongoose';
// import { v2 as cloudinary } from 'cloudinary';
// dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const app = express();
// app.use(cors());
// app.use(express.json());
// const PORT = process.env.PORT || 5000;
// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Optional MongoDB connection
// let WallpaperModel = null;
// if (process.env.MONGO_URI) {
//   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB error:', err));

//   const wallpaperSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     reward: Number,
//     url: String,
//     createdAt: { type: Date, default: Date.now }
//   });
//   WallpaperModel = mongoose.model('Wallpaper', wallpaperSchema);
// }

// // In-memory fallback + simple file persistence (data.json)
// const DATA_FILE = path.join(__dirname, 'data.json');
// let images = [];
// try {
//   if (fs.existsSync(DATA_FILE)) {
//     images = JSON.parse(fs.readFileSync(DATA_FILE));
//   }
// } catch (e) {
//   images = [];
// }

// // Multer memory storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// // Helper to save to fallback file
// function persistToFile() {
//   try {
//     fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2));
//   } catch (e) {
//     console.error('Failed to persist data:', e);
//   }
// }

// // GET images
// app.get('/api/images', async (req, res) => {
//   try {
//     if (WallpaperModel) {
//       const docs = await WallpaperModel.find().sort({ createdAt: -1 }).lean();
//       return res.json(docs);
//     } else {
//       return res.json(images);
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST upload
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   try {
//     const { name, email, reward } = req.body;
//     if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//     // Upload buffer to Cloudinary using upload_stream
//     const streamUpload = (buffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: 'doppelganster' },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result);
//           }
//         );
//         stream.end(buffer);
//       });
//     };

//     const result = await streamUpload(req.file.buffer);
//     const item = {
//       name: name || 'Anonymous',
//       email: email || '',
//       reward: reward ? Number(reward) : 0,
//       url: result.secure_url,
//       createdAt: new Date()
//     };

//     if (WallpaperModel) {
//       const doc = new WallpaperModel(item);
//       await doc.save();
//       return res.json(doc);
//     } else {
//       images.unshift(item);
//       persistToFile();
//       return res.json(item);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Serve frontend static for convenience (optional)
// app.use(express.static(path.join(__dirname, '..', 'frontend')));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   console.log('=== Upload request received ===');
//   console.log('body:', req.body);
//   console.log('file:', req.file && { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });
//   try {
//     // existing upload code...
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ error: err.message || 'Upload failed' });
//   }
// });
// console.log('CLOUD:', process.env.CLOUDINARY_CLOUD_NAME, 'KEY:', process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING');

import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// In-memory fallback + simple file persistence (data.json)
const DATA_FILE = path.join(__dirname, 'data.json');
let images = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    images = JSON.parse(fs.readFileSync(DATA_FILE));
  }
} catch (e) {
  images = [];
}

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Helper to save to fallback file
function persistToFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2));
  } catch (e) {
    console.error('Failed to persist data:', e);
  }
}

// GET images
app.get('/api/images', (req, res) => {
  return res.json(images);
});

// POST upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { name, email, reward, currency } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'doppelganster' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const item = {
      name: name || 'Anonymous',
      email: email || '',
      reward: reward ? Number(reward) : 0,
      currency: currency || '₹',
      url: result.secure_url,
      createdAt: new Date()
    };

    images.unshift(item);
    persistToFile();

    return res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static (optional)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CLOUD:', process.env.CLOUDINARY_CLOUD_NAME, 'KEY:', process.env.CLOUDINARY_API_KEY ? 'OK' : 'MISSING');
});

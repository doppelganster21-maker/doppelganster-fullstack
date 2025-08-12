# Doppelganster Fullstack (Node + Cloudinary)

This package contains a ready-to-run full-stack project using:

- **Frontend**: Static HTML/CSS/JS (design provided by you)
- **Backend**: Node.js + Express + Multer + Cloudinary
- **Database**: Optional MongoDB Atlas (if you set MONGO_URI). Otherwise falls back to a local `data.json`.

## Setup (local)

1. Unzip the project.
2. Backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and set CLOUDINARY_API_SECRET and optionally MONGO_URI
   npm start
   ```
   The backend listens on `PORT` (default 5000). It also serves the frontend static files for convenience.

3. Open `http://localhost:5000` in your browser. The frontend will call backend endpoints at the same origin automatically (you can change the `API_BASE` in `frontend/script.js` if needed).

## Deploy

- **Backend**: Render.com (free), Railway, or Heroku (if available). Add environment variables from `.env.example` in your deployment settings.
- **Frontend**: You can serve it from the backend (already configured) or deploy the `frontend` folder to Netlify / Vercel and set `API_BASE` to your backend URL.

## Notes & Security

- Do **NOT** commit your Cloudinary API secret to public repos. Use environment variables.
- For production, enable proper validation, reCAPTCHA, and moderation workflows.
- If you enable `MONGO_URI`, the app will save uploads to MongoDB. Otherwise data is stored in `backend/data.json` (simple fallback).

Enjoy!

"# face-match-site" 

# Deploying ForgeAI (step by step, no experience needed)

You're deploying two separate pieces:
- **Backend** (FastAPI + Gemini + ChromaDB) → hosted on **Render** (free tier)
- **Frontend** (React) → hosted on **Vercel** (free tier)

Total time: ~15 minutes. You'll end up with a real public link like
`https://forgeai-yourname.vercel.app` that anyone can open — no localhost.

---

## 0. First: rotate your Gemini API key

Your old key was sitting in `backend/.env` in plain text, which is not safe once this
project is public. Get a fresh one and keep it only in Render's dashboard, never in code:

1. Go to https://aistudio.google.com/apikey
2. Create a new API key, copy it.
3. Delete/revoke the old one from that same page.

---

## 1. Put the project on GitHub

1. Create a free account at https://github.com if you don't have one.
2. Create a new **empty** repository, e.g. `forgeai`.
3. On your computer, inside the unzipped `ForgeAI` folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/forgeai.git
   git push -u origin main
   ```
   (`backend/.env`, `venv/`, `node_modules/`, `vectorstore/` and `storage/` are already
   git-ignored, so your key and generated data won't be pushed.)

---

## 2. Deploy the backend on Render

1. Go to https://render.com → sign up (free) → **New +** → **Web Service**.
2. Connect your GitHub account and pick your `forgeai` repo.
3. Fill in:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     (Render also auto-detects this from the `Procfile` already in `backend/`.)
   - **Instance Type:** Free
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | your new key from Step 0 |
   | `GEMINI_MODEL` | `gemini-2.5-flash` |
   | `FRONTEND_ORIGINS` | `http://localhost:5173` (you'll add your real Vercel URL here after Step 3) |
   | `MAX_UPLOAD_MB` | `30` |
5. Click **Create Web Service**. First build takes 3–5 minutes (it installs `torch`,
   which is large — this is normal, be patient).
6. When it's live, copy the URL Render gives you, e.g.
   `https://forgeai-backend.onrender.com`. Open `<that-url>/health` in your browser —
   you should see `{"status": "Server Running", "success": true}`.

> Free Render services sleep after inactivity and take ~30–50s to wake up on the
> first request. That's expected on the free tier, not a bug.

---

## 3. Deploy the frontend on Vercel

1. Go to https://vercel.com → sign up (free) → **Add New** → **Project**.
2. Import the same `forgeai` GitHub repo.
3. Set:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | the Render URL from Step 2, e.g. `https://forgeai-backend.onrender.com` |
5. Click **Deploy**. In ~1 minute you'll get your live link, e.g.
   `https://forgeai-yourname.vercel.app` — this is what you share on LinkedIn.

---

## 4. Connect them (fix CORS)

Go back to **Render → your backend service → Environment**, and update
`FRONTEND_ORIGINS` to your real Vercel URL:

```
FRONTEND_ORIGINS=https://forgeai-yourname.vercel.app
```

Save — Render redeploys automatically. Reload your Vercel link and everything
(upload, chat, voice, all 7 tools) should work end-to-end from any device, for anyone.

---

## Updating the site later

Any time you `git push` to `main`, both Render and Vercel redeploy automatically.
No need to repeat these steps.

## Common issues

- **"Backend unreachable" banner in the app:** `VITE_API_URL` is wrong or missing, or
  the Render service is asleep — reload once after ~40s.
- **Upload fails / CORS error in browser console:** `FRONTEND_ORIGINS` on Render doesn't
  match your exact Vercel URL (must include `https://`, no trailing slash).
- **Chat says it can't answer:** double check `GEMINI_API_KEY` is set correctly on
  Render and the key hasn't been revoked.

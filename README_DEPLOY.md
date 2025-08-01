# Deployment Guide: AI Interview Analyzer

## Backend (FastAPI) on Hugging Face Spaces

1. **Files required in `api/`:**
   - `main.py`, `start.py`, `requirements.txt`, `Procfile`, `.env.example`, `.gitignore`, `README.md`
2. **Procfile** should contain:
   ```
   web: python start.py
   ```
3. **requirements.txt** should list all dependencies (already present).
4. **.env.example** should have:
   ```
   GROQ_API_KEY=your-groq-api-key
   ```
5. **.gitignore** should ignore `__pycache__/`, `uploads/`, `.env*`.
6. **README.md** should describe API endpoints and usage.
7. **On Hugging Face Spaces:**
   - Create a new Space (FastAPI SDK), connect your repo, set `GROQ_API_KEY` in the Space secrets.

## Frontend (Next.js) on Vercel

1. **Files required in root:**
   - `package.json`, `next.config.mjs`, `tsconfig.json`, `.env.local.example`, `.gitignore`, `README.md`
2. **.env.local.example** should have:
   ```
   NEXT_PUBLIC_API_URL=https://your-hf-space-url.hf.space
   ```
3. **.gitignore** should ignore `node_modules`, `.next/`, `.env*`, `uploads/`.
4. **README.md** should describe setup and deployment.
5. **On Vercel:**
   - Import your repo, set `NEXT_PUBLIC_API_URL` in Vercel environment variables.

---

**You are now ready to deploy!**

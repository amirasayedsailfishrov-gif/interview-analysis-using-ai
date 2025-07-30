# 🚀 Deployment Guide: Vercel + Hugging Face Spaces

## 📋 Prerequisites
- GitHub account
- Vercel account (free)
- Hugging Face account (free)

## 🔧 Step 1: Deploy Backend on Hugging Face Spaces

### A) Create a new Hugging Face Space:
1. Go to https://huggingface.co/new-space
2. Choose:
   - **Space name**: `ai-interview-analyzer-api` (or your preferred name)
   - **License**: MIT
   - **SDK**: Docker
   - **Hardware**: CPU basic (free)

### B) Upload backend files:
Upload these files from the `api/` folder to your HF Space:
- `main.py`
- `app.py` (entry point)
- `requirements.txt`
- `Dockerfile`
- `README.md`
- `analysis.py`
- `utils.py`
- `memory_store.py`

### C) Your API will be available at:
`https://your-username-ai-interview-analyzer-api.hf.space`

## 🎯 Step 2: Deploy Frontend on Vercel

### A) Push code to GitHub:
1. Create a new GitHub repository
2. Upload your frontend code (root folder, not just api/)

### B) Deploy on Vercel:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. **Environment Variables** - Add:
   ```
   NEXT_PUBLIC_API_URL=https://your-username-ai-interview-analyzer-api.hf.space
   ```
5. Deploy!

## 🔄 Step 3: Update API URL

After your HF Space is live, update the environment variable in Vercel:
1. Go to your Vercel project settings
2. Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your actual HF Space URL

## ✅ Final URLs:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-username-space-name.hf.space`

## 🛠️ Notes:
- Both services are **completely free**
- **No credit card** required
- **Auto-deployment** from GitHub
- **Custom domains** available (optional)

## 📝 Troubleshooting:
1. If CORS errors: Check the backend CORS settings in `main.py`
2. If API errors: Verify the `NEXT_PUBLIC_API_URL` in Vercel environment variables
3. If HF Space doesn't start: Check the logs in the HF Space interface

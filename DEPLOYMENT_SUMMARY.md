# Deployment Summary - Quick Start

## 🎯 Fastest Path to Deployment (30 minutes)

### 1. Database (5 min)
```bash
# Option A: Railway (Easiest)
1. Go to railway.app → New → Database → PostgreSQL
2. Copy DATABASE_URL

# Option B: Supabase
1. Go to supabase.com → New Project
2. Copy connection string
```

### 2. Load Data (10 min)
```bash
cd backend
source venv/bin/activate
export DATABASE_URL="your-postgres-url"
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

### 3. Deploy Backend (10 min)
```bash
# Railway
1. railway.app → New → GitHub Repo
2. Select repository
3. Set Root Directory: backend
4. Set Start Command: uvicorn src.index:app --host 0.0.0.0 --port $PORT
5. Add DATABASE_URL variable
6. Deploy!

# Get backend URL: https://your-app.up.railway.app
```

### 4. Deploy Frontend (5 min)
```bash
cd frontend
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend.up.railway.app/api

# Get frontend URL: https://your-app.vercel.app
```

### 5. Update CORS
```bash
# In Railway backend variables:
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## ✅ Done!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.up.railway.app`
- API Docs: `https://your-app.up.railway.app/docs`

---

## 📚 Detailed Guides

- **Complete Guide**: `END_TO_END_DEPLOYMENT.md`
- **Checklist**: `DEPLOYMENT_CHECKLIST.md`
- **Troubleshooting**: See `DEPLOYMENT_GUIDE.md`


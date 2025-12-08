# Quick Deployment Guide - PostgreSQL Required

> **For detailed step-by-step instructions, see `END_TO_END_DEPLOYMENT.md`**

## ⚠️ IMPORTANT: SQLite Won't Work for Deployment

**SQLite will fail in production deployments** because:
- ❌ Serverless platforms have read-only file systems
- ❌ Cloud platforms use ephemeral storage
- ❌ Multiple server instances can't share SQLite files
- ❌ Database locks under concurrent load

## ✅ Solution: Use PostgreSQL (Already Configured!)

Your code **already supports PostgreSQL**. Just follow these steps:

## 🚀 Quickest Deployment Path (Railway + Vercel)

### Step 1: Get Free PostgreSQL Database

**Option A: Supabase (Easiest)**
1. Go to https://supabase.com → Sign up (free)
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (URI format)
5. It looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

**Option B: Railway (Recommended)**
1. Go to https://railway.app → Sign up
2. Create new project → Add PostgreSQL database
3. Copy connection string from database settings

### Step 2: Load Data to PostgreSQL

```bash
cd backend

# Set your PostgreSQL connection string
export DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Load data (takes a few minutes for 1M rows)
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

### Step 3: Deploy Backend

**Railway (Easiest):**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway up
```

**Or Render:**
1. Connect GitHub repo to Render
2. Render auto-detects `render.yaml`
3. PostgreSQL database is created automatically
4. Set `DATABASE_URL` in environment variables

### Step 4: Deploy Frontend

**Vercel (Easiest):**
```bash
cd frontend
npm i -g vercel
vercel

# Set environment variable in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app
```

### Step 5: Update CORS

In Railway/Render backend settings, add environment variable:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

## 📋 Complete Checklist

- [ ] Get PostgreSQL database (Supabase/Railway/Neon)
- [ ] Set `DATABASE_URL` environment variable
- [ ] Load data: `python -m src.utils.loadData ../truestate_assignment_dataset.csv`
- [ ] Deploy backend (Railway/Render)
- [ ] Deploy frontend (Vercel)
- [ ] Set `NEXT_PUBLIC_API_URL` in frontend
- [ ] Set `ALLOWED_ORIGINS` in backend
- [ ] Test deployed application

## 🎯 Recommended Stack (All Free)

- **Backend:** Railway (includes free PostgreSQL)
- **Frontend:** Vercel (free hosting)
- **Database:** PostgreSQL (included with Railway)

**Total Cost: $0** ✅

## 🔧 Environment Variables Needed

### Backend:
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
ALLOWED_ORIGINS=https://your-frontend.vercel.app
PORT=8000  # Usually auto-set by platform
```

### Frontend:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## ⚡ One-Command Setup (After Initial Config)

Once you have PostgreSQL URL:

```bash
# Backend
cd backend
export DATABASE_URL="your-postgres-url"
python -m src.utils.loadData ../truestate_assignment_dataset.csv
railway up

# Frontend (in another terminal)
cd frontend
vercel
```

## 🆘 Troubleshooting

**"Database file not found"**
→ You're using SQLite. Switch to PostgreSQL.

**"Read-only file system"**
→ Platform doesn't support SQLite. Use PostgreSQL.

**"Connection refused"**
→ Check `DATABASE_URL` format and database is accessible.

**"CORS error"**
→ Add frontend URL to `ALLOWED_ORIGINS` in backend.

## 📚 Full Guide

See `DEPLOYMENT_GUIDE.md` for detailed instructions for all platforms.


# End-to-End Deployment Guide

Complete step-by-step guide to deploy your Retail Sales Management System to production.

## 🎯 Overview

This guide will help you deploy:
- **Backend**: FastAPI application (Railway or Render)
- **Frontend**: Next.js application (Vercel)
- **Database**: PostgreSQL (included with Railway/Render)

**Estimated Time**: 30-45 minutes  
**Cost**: $0 (using free tiers)

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account (free)
- [ ] Code pushed to a GitHub repository
- [ ] CSV data file ready (`truestate_assignment_dataset.csv`)
- [ ] 30-45 minutes of time

---

## 🚀 Step 1: Prepare Your Code for Deployment

### 1.1 Push Code to GitHub

If you haven't already:

```bash
cd /Users/shreyansh_gupta/Desktop/truestate

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Retail Sales Management System"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/truestate.git
git branch -M main
git push -u origin main
```

**Important**: Make sure `.gitignore` excludes:
- `venv/`
- `node_modules/`
- `*.db` (SQLite files)
- `.env` files

---

## 🗄️ Step 2: Set Up PostgreSQL Database

### Option A: Railway (Recommended - Easiest)

#### 2.1 Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub (easiest)

#### 2.2 Create PostgreSQL Database
1. In Railway dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Wait for database to provision (30 seconds)
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. Copy the `DATABASE_URL` value (you'll need this later)

**Save this DATABASE_URL somewhere safe!**

#### 2.3 Test Database Connection (Optional)
You can test the connection using:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Connect to database
railway link
railway connect postgres
```

---

### Option B: Supabase (Alternative)

#### 2.1 Create Supabase Account
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project

#### 2.2 Get Connection String
1. Go to Project Settings → Database
2. Under "Connection string", select "URI"
3. Copy the connection string
4. Replace `[YOUR-PASSWORD]` with your database password

**Format**: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

---

## 🔧 Step 3: Load Data into PostgreSQL

### 3.1 Install PostgreSQL Client (if needed)

**macOS:**
```bash
brew install postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql-client
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

### 3.2 Load Data Locally

```bash
cd /Users/shreyansh_gupta/Desktop/truestate/backend

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Set PostgreSQL connection string
export DATABASE_URL="postgresql://user:password@host:5432/dbname"
# Use the DATABASE_URL from Railway/Supabase

# Load data (this will take 5-10 minutes for 1M rows)
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

**Expected Output:**
```
Loading data from ../truestate_assignment_dataset.csv...
Loaded 10000 rows...
Loaded 20000 rows...
...
Successfully loaded 1000000 rows into database!
```

### 3.3 Verify Data Loaded

Test the connection:
```bash
# Using Railway CLI
railway connect postgres
# Then run: SELECT COUNT(*) FROM sales_transactions;

# Or using psql directly
psql "your-database-url"
SELECT COUNT(*) FROM sales_transactions;
```

---

## 🚢 Step 4: Deploy Backend

### Option A: Railway (Recommended)

#### 4.1 Connect Repository
1. In Railway dashboard, click "New"
2. Select "GitHub Repo"
3. Choose your `truestate` repository
4. Railway will auto-detect it's a Python project

#### 4.2 Configure Backend Service
1. Railway will create a new service
2. Click on the service
3. Go to "Settings" → "Root Directory"
4. Set to: `backend`
5. Go to "Settings" → "Start Command"
6. Set to: `uvicorn src.index:app --host 0.0.0.0 --port $PORT`

#### 4.3 Set Environment Variables
1. Go to "Variables" tab
2. Add these variables:

```
DATABASE_URL=postgresql://... (from PostgreSQL service)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
PORT=8000
```

**To get DATABASE_URL:**
- Click on your PostgreSQL service
- Go to "Variables"
- Copy `DATABASE_URL`

#### 4.4 Deploy
1. Railway will automatically deploy when you push to GitHub
2. Or click "Deploy" button
3. Wait for deployment (2-3 minutes)
4. Once deployed, Railway will give you a URL like: `https://your-app.up.railway.app`

#### 4.5 Test Backend
```bash
# Test health endpoint
curl https://your-app.up.railway.app/health

# Should return: {"status":"healthy"}

# Test API docs
# Open: https://your-app.up.railway.app/docs
```

---

### Option B: Render (Alternative)

#### 4.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

#### 4.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `truestate-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn src.index:app --host 0.0.0.0 --port $PORT`

#### 4.3 Add PostgreSQL Database
1. Click "New" → "PostgreSQL"
2. Create database
3. Copy connection string

#### 4.4 Set Environment Variables
In Web Service → Environment:
```
DATABASE_URL=<from PostgreSQL service>
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

#### 4.5 Deploy
1. Click "Create Web Service"
2. Render will deploy automatically
3. Get your URL: `https://truestate-backend.onrender.com`

---

## 🎨 Step 5: Deploy Frontend

### 5.1 Deploy to Vercel

#### 5.1.1 Install Vercel CLI
```bash
npm i -g vercel
```

#### 5.1.2 Login to Vercel
```bash
vercel login
```

#### 5.1.3 Deploy Frontend
```bash
cd /Users/shreyansh_gupta/Desktop/truestate/frontend

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? truestate-frontend
# - Directory? ./
# - Override settings? N
```

#### 5.1.4 Set Environment Variable
1. Go to Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend.up.railway.app/api
   ```
5. Click "Save"
6. Go to "Deployments" → Click "..." → "Redeploy"

#### 5.1.5 Get Frontend URL
- Vercel will give you a URL like: `https://truestate-frontend.vercel.app`

---

### Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.up.railway.app/api`
6. Click "Deploy"

---

## 🔗 Step 6: Update CORS Settings

### 6.1 Update Backend CORS

Go back to your backend deployment (Railway/Render):

1. **Railway:**
   - Go to your backend service
   - "Variables" tab
   - Update `ALLOWED_ORIGINS`:
     ```
     ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
     ```
   - Redeploy

2. **Render:**
   - Go to your web service
   - "Environment" tab
   - Update `ALLOWED_ORIGINS`
   - Save changes (auto-redeploys)

---

## ✅ Step 7: Test Deployment

### 7.1 Test Backend
```bash
# Health check
curl https://your-backend.up.railway.app/health

# API docs
# Open: https://your-backend.up.railway.app/docs

# Test API endpoint
curl "https://your-backend.up.railway.app/api/sales/transactions?page=1&page_size=10"
```

### 7.2 Test Frontend
1. Open: `https://your-frontend.vercel.app`
2. You should see the Sales Management System
3. Test features:
   - Search
   - Filters
   - Sorting
   - Pagination

### 7.3 Verify Data
- Check if transactions are loading
- Try searching for a customer name
- Apply filters
- Test pagination

---

## 🔄 Step 8: Continuous Deployment Setup

### 8.1 Automatic Deployments

Both Railway and Vercel automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway and Vercel will auto-deploy!
```

### 8.2 Monitor Deployments

- **Railway**: Dashboard → Your service → "Deployments"
- **Vercel**: Dashboard → Your project → "Deployments"

---

## 🐛 Troubleshooting

### Issue: Backend not connecting to database

**Solution:**
1. Check `DATABASE_URL` is set correctly
2. Verify database is accessible (not paused)
3. Check database connection limits

### Issue: CORS errors

**Solution:**
1. Update `ALLOWED_ORIGINS` in backend
2. Include exact frontend URL (with https://)
3. Redeploy backend

### Issue: Frontend can't reach backend

**Solution:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check backend URL is accessible
3. Ensure backend is deployed and running

### Issue: No data showing

**Solution:**
1. Verify data was loaded to PostgreSQL
2. Check database connection
3. Test API endpoint directly: `/api/sales/transactions`

### Issue: Build fails

**Solution:**
1. Check build logs in Railway/Vercel
2. Verify all dependencies in `requirements.txt`/`package.json`
3. Check Python/Node version compatibility

---

## 📊 Deployment Checklist

Use this checklist to ensure everything is deployed:

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created
- [ ] Data loaded into PostgreSQL
- [ ] Backend deployed (Railway/Render)
- [ ] Backend environment variables set
- [ ] Backend health check working
- [ ] Frontend deployed (Vercel)
- [ ] Frontend environment variable set (`NEXT_PUBLIC_API_URL`)
- [ ] CORS configured correctly
- [ ] Frontend can access backend API
- [ ] Data displaying in frontend
- [ ] All features working (search, filter, sort, pagination)

---

## 🎯 Quick Reference

### Backend URLs
- **Railway**: `https://your-app.up.railway.app`
- **Render**: `https://your-app.onrender.com`

### Frontend URLs
- **Vercel**: `https://your-app.vercel.app`

### Environment Variables

**Backend:**
```
DATABASE_URL=postgresql://...
ALLOWED_ORIGINS=https://your-frontend.vercel.app
PORT=8000
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

---

## 💰 Cost Breakdown

### Free Tier Limits

**Railway:**
- $5 free credit/month
- Enough for small projects
- PostgreSQL included

**Vercel:**
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for frontend

**Supabase:**
- 500MB database
- Unlimited API requests
- Great for development

**Total Cost: $0/month** ✅

---

## 🚀 Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

2. **Set up monitoring**
   - Railway: Built-in metrics
   - Vercel: Analytics included

3. **Set up backups**
   - Railway: Automatic backups
   - Supabase: Manual backups available

4. **Optimize performance**
   - Enable caching
   - Optimize database queries
   - Use CDN (Vercel includes this)

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Render Docs**: https://render.com/docs

---

## ✅ Success Criteria

Your deployment is successful when:
1. ✅ Backend API is accessible
2. ✅ Frontend loads without errors
3. ✅ Data displays correctly
4. ✅ All features work (search, filter, sort, paginate)
5. ✅ No CORS errors
6. ✅ API responses are fast (< 1 second)

---

## 🎉 Congratulations!

You've successfully deployed your Retail Sales Management System!

**Your Live URLs:**
- Frontend: `https://your-frontend.vercel.app`
- Backend API: `https://your-backend.up.railway.app`
- API Docs: `https://your-backend.up.railway.app/docs`

Share these URLs in your assignment submission!


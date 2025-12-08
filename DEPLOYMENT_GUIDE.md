# Deployment Guide - Why SQLite Won't Work & PostgreSQL Solution

## ⚠️ Critical: SQLite Issues in Deployment

**SQLite will cause problems in production deployments!** Here's why:

### 🚨 Major Issues with SQLite in Deployment:

1. **File System Problems:**
   - ❌ **Serverless platforms** (Vercel, Netlify): Read-only file systems - SQLite can't write
   - ❌ **Docker containers**: Files may not persist between restarts
   - ❌ **Cloud platforms**: Ephemeral file systems - database file gets deleted
   - ❌ **Multiple instances**: Each server has its own database file (data inconsistency)

2. **Concurrency Issues:**
   - ❌ Limited concurrent writes (database locks)
   - ❌ Poor performance under load
   - ❌ Can cause "database is locked" errors

3. **Scalability Problems:**
   - ❌ Can't scale horizontally (multiple servers)
   - ❌ Single point of failure
   - ❌ No replication support

4. **Platform-Specific Issues:**
   - ❌ **Vercel/Netlify**: Read-only file system
   - ❌ **Railway/Render**: Ephemeral storage
   - ❌ **Heroku**: Filesystem is temporary
   - ❌ **AWS Lambda**: Read-only filesystem

## ✅ Solution: Use PostgreSQL for Deployment

**PostgreSQL is the industry standard for production deployments.**

## 🚀 Quick Deployment Setup

### Step 1: Get Free PostgreSQL Database

Choose one of these free options:

#### Option A: Supabase (Recommended - Easiest)
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy connection string from Settings → Database
5. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

#### Option B: Railway
1. Go to https://railway.app
2. Sign up (free tier available)
3. Create PostgreSQL database
4. Copy connection string

#### Option C: Neon
1. Go to https://neon.tech
2. Sign up (free tier)
3. Create database
4. Copy connection string

### Step 2: Update Your Code

Your code **already supports PostgreSQL!** Just set the environment variable:

```bash
# Set DATABASE_URL to your PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

### Step 3: Install PostgreSQL Driver

```bash
cd backend
pip install psycopg2-binary
```

Add to `requirements.txt`:
```
psycopg2-binary==2.9.9
```

### Step 4: Load Data to PostgreSQL

```bash
# Set DATABASE_URL first
export DATABASE_URL=postgresql://user:password@host:5432/dbname

# Load data
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

## 📦 Platform-Specific Deployment Guides

### Option 1: Railway (Easiest - Recommended)

#### Backend Deployment:

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize Project:**
   ```bash
   cd backend
   railway init
   ```

3. **Add PostgreSQL:**
   - Go to Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Load Data:**
   ```bash
   # Get database URL from Railway dashboard
   railway variables
   # Copy DATABASE_URL, then:
   export DATABASE_URL=<your-railway-postgres-url>
   python -m src.utils.loadData ../truestate_assignment_dataset.csv
   ```

#### Frontend Deployment:

1. **Deploy to Vercel:**
   ```bash
   cd frontend
   npm i -g vercel
   vercel
   ```

2. **Set Environment Variable:**
   - In Vercel dashboard, add:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.railway.app
     ```

### Option 2: Render

#### Backend Deployment:

1. **Create `render.yaml` in backend/ folder:**
   ```yaml
   services:
     - type: web
       name: truestate-backend
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn src.index:app --host 0.0.0.0 --port $PORT
       envVars:
         - key: DATABASE_URL
           fromDatabase:
             name: truestate-db
             property: connectionString
   
   databases:
     - name: truestate-db
       plan: free
       databaseName: truestate
       user: truestate_user
   ```

2. **Deploy:**
   - Connect GitHub repo to Render
   - Render will auto-detect and deploy

#### Frontend Deployment:

1. **Deploy to Vercel or Netlify:**
   ```bash
   cd frontend
   vercel  # or netlify deploy
   ```

### Option 3: Heroku

#### Backend Deployment:

1. **Create `Procfile` in backend/ folder:**
   ```
   web: uvicorn src.index:app --host 0.0.0.0 --port $PORT
   ```

2. **Create `runtime.txt`:**
   ```
   python-3.11.0
   ```

3. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   git push heroku main
   ```

4. **Load Data:**
   ```bash
   heroku run python -m src.utils.loadData ../truestate_assignment_dataset.csv
   ```

### Option 4: Docker Deployment

#### Create `Dockerfile` in backend/:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "src.index:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: truestate
      POSTGRES_PASSWORD: yourpassword
      POSTGRES_DB: sales_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://truestate:yourpassword@db:5432/sales_db
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### Deploy:
```bash
docker-compose up -d
```

## 🔧 Environment Variables Setup

### Backend Environment Variables:

```bash
# Required for production
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Optional
PORT=8000
ENVIRONMENT=production
```

### Frontend Environment Variables:

```bash
# Required
NEXT_PUBLIC_API_URL=https://your-backend-url.com

# Optional
NEXT_PUBLIC_ENV=production
```

## 📝 Deployment Checklist

### Before Deployment:

- [ ] Switch to PostgreSQL (set `DATABASE_URL`)
- [ ] Install `psycopg2-binary` in requirements.txt
- [ ] Update CORS origins in `backend/src/index.py` to include production frontend URL
- [ ] Set `NEXT_PUBLIC_API_URL` in frontend
- [ ] Load data into PostgreSQL database
- [ ] Test locally with PostgreSQL connection string

### Backend Checklist:

- [ ] PostgreSQL database created
- [ ] `DATABASE_URL` environment variable set
- [ ] Data loaded successfully
- [ ] API endpoints working
- [ ] CORS configured for frontend domain
- [ ] Health check endpoint working (`/health`)

### Frontend Checklist:

- [ ] `NEXT_PUBLIC_API_URL` set to backend URL
- [ ] Build succeeds (`npm run build`)
- [ ] API calls working
- [ ] All features functional

## 🎯 Recommended Deployment Stack

### For Assignment Submission:

**Backend:** Railway (free PostgreSQL + easy deployment)
**Frontend:** Vercel (free, automatic deployments)

**Why:**
- ✅ Both have free tiers
- ✅ Easy setup
- ✅ Automatic deployments from GitHub
- ✅ PostgreSQL included
- ✅ Professional and production-ready

### Steps:

1. **Backend on Railway:**
   ```bash
   cd backend
   railway init
   # Add PostgreSQL database in Railway dashboard
   railway up
   ```

2. **Frontend on Vercel:**
   ```bash
   cd frontend
   vercel
   # Set NEXT_PUBLIC_API_URL to Railway backend URL
   ```

3. **Load Data:**
   ```bash
   # Get DATABASE_URL from Railway
   export DATABASE_URL=<railway-postgres-url>
   python -m src.utils.loadData ../truestate_assignment_dataset.csv
   ```

## 🚨 Common Deployment Issues & Solutions

### Issue 1: "Database file not found"
**Solution:** You're using SQLite. Switch to PostgreSQL.

### Issue 2: "Read-only file system"
**Solution:** Platform doesn't support file writes. Use PostgreSQL.

### Issue 3: "Connection refused"
**Solution:** Check `DATABASE_URL` format and database is accessible.

### Issue 4: "Module not found: psycopg2"
**Solution:** Add `psycopg2-binary` to requirements.txt and redeploy.

### Issue 5: "CORS error"
**Solution:** Update CORS origins in `backend/src/index.py` to include frontend URL.

## 📊 Comparison: SQLite vs PostgreSQL for Deployment

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Serverless (Vercel) | ❌ Won't work | ✅ Works |
| Docker | ⚠️ Issues | ✅ Works |
| Multiple Instances | ❌ Won't work | ✅ Works |
| Cloud Platforms | ❌ Won't work | ✅ Works |
| Production Ready | ❌ No | ✅ Yes |
| Free Tier Available | ✅ Yes | ✅ Yes |

## ✅ Final Recommendation

**For Deployment: Use PostgreSQL**

1. Get free PostgreSQL from Supabase/Railway/Neon
2. Set `DATABASE_URL` environment variable
3. Install `psycopg2-binary`
4. Load data
5. Deploy!

**Your code already supports PostgreSQL - just change the environment variable!**


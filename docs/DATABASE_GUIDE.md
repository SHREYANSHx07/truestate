# Database Selection Guide

## Current Setup: SQLite

The project is currently configured to use **SQLite** by default, which is perfect for:
- ✅ Development and testing
- ✅ Quick setup (no installation needed)
- ✅ Small to medium datasets
- ✅ Single-user scenarios

## Recommendation: PostgreSQL for Production

For production deployment or handling large datasets (1M+ rows), **PostgreSQL** is strongly recommended:

### Why PostgreSQL?

1. **Performance**
   - Better query optimization
   - Advanced indexing (GIN, GiST)
   - Full-text search capabilities
   - Better handling of concurrent queries

2. **Scalability**
   - Handles millions of rows efficiently
   - Better connection pooling
   - Supports multiple concurrent users

3. **Features**
   - Advanced data types
   - Better date/time handling
   - Full-text search (can improve search performance)
   - JSON support (if needed later)

4. **Production Ready**
   - Industry standard
   - Better backup/recovery options
   - Replication support
   - Cloud hosting options (AWS RDS, Heroku Postgres, etc.)

## Database Comparison

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Setup Complexity | ⭐ Easy | ⭐⭐ Moderate |
| Performance (1M+ rows) | ⭐⭐ Good | ⭐⭐⭐ Excellent |
| Concurrent Users | ⭐ Single | ⭐⭐⭐ Many |
| Production Ready | ⭐⭐ Limited | ⭐⭐⭐ Yes |
| Full-text Search | ⭐ Basic | ⭐⭐⭐ Advanced |
| Cloud Hosting | ⭐ Limited | ⭐⭐⭐ Many options |

## When to Use Each

### Use SQLite When:
- ✅ Development/testing
- ✅ Small datasets (< 500K rows)
- ✅ Single user/developer
- ✅ Quick prototyping
- ✅ Assignment submission (if allowed)

### Use PostgreSQL When:
- ✅ Production deployment
- ✅ Large datasets (1M+ rows)
- ✅ Multiple concurrent users
- ✅ Need advanced features
- ✅ Cloud deployment
- ✅ Long-term scalability

## Setup Instructions

### Option 1: SQLite (Current - No Changes Needed)
```bash
# Already configured - just run:
cd backend
python src/index.py
```

### Option 2: PostgreSQL (Recommended for Production)

#### Step 1: Install PostgreSQL
**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

#### Step 2: Create Database
```bash
# Create database and user
createdb sales_db
# Or using psql:
psql postgres
CREATE DATABASE sales_db;
CREATE USER sales_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sales_db TO sales_user;
\q
```

#### Step 3: Install PostgreSQL Driver
```bash
cd backend
pip install psycopg2-binary
# Or for async: pip install asyncpg
```

#### Step 4: Update Environment Variable
Create `.env` file in `backend/` directory:
```bash
DATABASE_URL=postgresql://sales_user:your_password@localhost:5432/sales_db
```

#### Step 5: Update requirements.txt
Add to `backend/requirements.txt`:
```
psycopg2-binary==2.9.9
```

#### Step 6: Load Data
```bash
python -m src.utils.loadData ../truestate_assignment_dataset.csv
```

#### Step 7: Run Application
```bash
python src/index.py
```

## Performance Optimization Tips

### For SQLite:
1. **Create Indexes** (already done in code)
2. **Use WAL Mode** (for better concurrency):
   ```python
   # Add to database.py
   engine = create_engine(
       DATABASE_URL,
       connect_args={"check_same_thread": False, "timeout": 20}
   )
   ```

### For PostgreSQL:
1. **Connection Pooling**:
   ```python
   from sqlalchemy.pool import QueuePool
   
   engine = create_engine(
       DATABASE_URL,
       poolclass=QueuePool,
       pool_size=10,
       max_overflow=20
   )
   ```

2. **Create Additional Indexes**:
   ```sql
   CREATE INDEX idx_customer_name_lower ON sales_transactions(LOWER(customer_name));
   CREATE INDEX idx_date_customer ON sales_transactions(date, customer_name);
   ```

3. **Full-Text Search** (for better search performance):
   ```sql
   CREATE INDEX idx_customer_name_fts ON sales_transactions 
   USING gin(to_tsvector('english', customer_name));
   ```

## Cloud Database Options

### Free Tier Options:
1. **Supabase** (PostgreSQL)
   - Free tier: 500MB database
   - Easy setup
   - URL: https://supabase.com

2. **Railway** (PostgreSQL)
   - Free tier available
   - Simple deployment
   - URL: https://railway.app

3. **Neon** (PostgreSQL)
   - Serverless PostgreSQL
   - Free tier available
   - URL: https://neon.tech

### Production Options:
1. **AWS RDS PostgreSQL**
2. **Google Cloud SQL**
3. **Azure Database for PostgreSQL**
4. **Heroku Postgres**

## Migration from SQLite to PostgreSQL

The code is already designed to work with both! Just:
1. Install PostgreSQL
2. Update `DATABASE_URL` environment variable
3. Install `psycopg2-binary`
4. Run data loading script
5. Done! ✅

## Recommendation for Your Assignment

### For Assignment Submission:
- **SQLite is fine** - it's simpler and works well for demonstration
- No additional setup required
- Easy for reviewers to test

### For Production/Real-World:
- **Use PostgreSQL** - better performance and scalability
- More professional
- Industry standard

## Quick Decision Matrix

```
Is this for assignment submission only?
├─ YES → Use SQLite ✅
└─ NO → Continue...

Will you deploy to production?
├─ YES → Use PostgreSQL ✅
└─ NO → Continue...

Do you have > 500K rows?
├─ YES → Use PostgreSQL ✅
└─ NO → SQLite is fine ✅

Do you need multiple concurrent users?
├─ YES → Use PostgreSQL ✅
└─ NO → SQLite is fine ✅
```

## Current Configuration

The project is configured to use **SQLite by default** but can easily switch to PostgreSQL by:
1. Setting `DATABASE_URL` environment variable
2. Installing `psycopg2-binary`
3. That's it! The code handles both automatically.


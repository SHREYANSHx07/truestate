# Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] Code is pushed to GitHub repository
- [ ] `.gitignore` excludes sensitive files (venv, .env, *.db)
- [ ] All dependencies are in `requirements.txt` and `package.json`
- [ ] CSV data file is accessible

## Database Setup

- [ ] PostgreSQL database created (Railway/Supabase)
- [ ] Database connection string copied
- [ ] Data loaded into PostgreSQL (1M rows)
- [ ] Verified data exists: `SELECT COUNT(*) FROM sales_transactions;`

## Backend Deployment

### Railway
- [ ] Railway account created
- [ ] Repository connected to Railway
- [ ] Backend service created
- [ ] Root directory set to `backend`
- [ ] Start command set: `uvicorn src.index:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set:
  - [ ] `DATABASE_URL`
  - [ ] `ALLOWED_ORIGINS`
- [ ] Backend deployed successfully
- [ ] Health check working: `/health`
- [ ] API docs accessible: `/docs`

### Render (Alternative)
- [ ] Render account created
- [ ] Web service created
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Service deployed

## Frontend Deployment

- [ ] Vercel account created
- [ ] Repository connected to Vercel
- [ ] Frontend project created
- [ ] Root directory set to `frontend`
- [ ] Environment variable set: `NEXT_PUBLIC_API_URL`
- [ ] Frontend deployed successfully
- [ ] Frontend URL accessible

## Configuration

- [ ] Backend CORS includes frontend URL
- [ ] Frontend API URL points to backend
- [ ] All environment variables set correctly

## Testing

- [ ] Backend health endpoint works
- [ ] Backend API endpoints respond
- [ ] Frontend loads without errors
- [ ] Data displays in frontend
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Sorting works correctly
- [ ] Pagination works correctly
- [ ] No CORS errors in browser console
- [ ] No API errors in browser console

## Final Verification

- [ ] All features working end-to-end
- [ ] Performance is acceptable (< 2s load time)
- [ ] Mobile responsive (test on phone)
- [ ] URLs documented for submission

## URLs to Document

- [ ] Frontend URL: `_________________________`
- [ ] Backend URL: `_________________________`
- [ ] API Docs URL: `_________________________`
- [ ] GitHub Repository: `_________________________`

## Notes

Add any issues or notes here:
_________________________________________________
_________________________________________________
_________________________________________________


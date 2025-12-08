# Quick Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load data from CSV (this may take a few minutes for 1M+ rows)
python -m src.utils.loadData ../truestate_assignment_dataset.csv

# Start the server
python src/index.py
# Or: uvicorn src.index:app --reload --port 8000
```

Backend will run on `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 3. Verify Setup

1. Open `http://localhost:3000` in your browser
2. You should see the Sales Management System interface
3. Try searching, filtering, sorting, and pagination
4. Check backend API at `http://localhost:8000/docs`

## Troubleshooting

### Backend Issues

**Import Errors:**
- Make sure you're running from the `backend` directory
- Ensure virtual environment is activated
- Check that all dependencies are installed

**Database Issues:**
- Make sure the CSV file path is correct
- Check that SQLite database file is created in backend directory
- Verify data was loaded (check row count)

**Port Already in Use:**
- Change port in `src/index.py` or use: `uvicorn src.index:app --port 8001`

### Frontend Issues

**API Connection Errors:**
- Verify backend is running on port 8000
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` in `.env.local` (if set)

**Build Errors:**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Production Deployment

### Backend
- Use production ASGI server (Gunicorn + Uvicorn)
- Set up environment variables
- Use PostgreSQL instead of SQLite
- Enable proper CORS for production domain

### Frontend
- Build: `npm run build`
- Start: `npm start`
- Or deploy to Vercel/Netlify
- Set `NEXT_PUBLIC_API_URL` to production API URL


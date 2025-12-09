# Retail Sales Management System

## Overview
A comprehensive full-stack application for managing and analyzing retail sales transactions. The system provides advanced search, filtering, sorting, and pagination capabilities to efficiently handle large datasets of sales data. Built with FastAPI backend and Next.js frontend, demonstrating professional software engineering practices with clean architecture and maintainable code.

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (production-ready for PostgreSQL)
- **ORM**: SQLAlchemy
- **Data Processing**: Pandas

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS-in-JS (styled-jsx)
- **HTTP Client**: Axios

## Search Implementation Summary

The search functionality implements **case-insensitive full-text search** across Customer Name and Phone Number fields.

**Backend Implementation**:
- Uses SQLAlchemy's `func.lower()` for case-insensitive matching
- Implements `LIKE` queries with wildcard pattern matching (`%search_term%`)
- Searches both customer_name and phone_number fields using OR condition
- Works seamlessly with filters and sorting

**Frontend Implementation**:
- Real-time search with **300ms debouncing** to reduce API calls
- Search term is passed as query parameter
- Maintains search state alongside filters and sorting

**Performance**: Optimized with database indexes on searchable fields for fast query execution even with large datasets.

## Filter Implementation Summary

The system supports **multi-select filtering** across multiple dimensions with independent and combined filter support.

**Filter Types**:
1. **Customer Region**: Multi-select dropdown
2. **Gender**: Multi-select checkbox group
3. **Age Range**: Min/Max numeric inputs
4. **Product Category**: Multi-select checkbox group
5. **Tags**: Multi-select checkbox group (handles comma-separated tags)
6. **Payment Method**: Multi-select checkbox group
7. **Date Range**: Start and end date pickers

**Backend Implementation**:
- Filters are applied using SQLAlchemy's `in_()` for multi-select
- Age and date ranges use `>=` and `<=` operators
- Tags use `LIKE` pattern matching for comma-separated values
- All filters combined with AND logic (all must match)
- Empty filter arrays are ignored (no filter applied)

**Frontend Implementation**:
- Filter state managed in React state
- Checkbox groups for multi-select filters
- Range inputs for age and date
- "Clear All" button to reset all filters
- Filters persist across pagination and sorting

**Edge Cases Handled**:
- Empty filter selections (no filter applied)
- Invalid date ranges (gracefully ignored)
- Conflicting filters (AND logic ensures consistency)
- Missing optional fields (handled in database queries)

## Sorting Implementation Summary

The sorting functionality supports **multiple sort options** with ascending and descending order.

**Sort Options**:
1. **Date**: Newest First (default) / Oldest First
2. **Quantity**: High to Low / Low to High
3. **Customer Name**: A-Z / Z-A

**Backend Implementation**:
- Uses SQLAlchemy's `order_by()` with `desc()` and `asc()`
- Sort parameter passed as query string (e.g., `date_desc`, `quantity_asc`)
- Default sorting: Date (Newest First)
- Sorting applied after filtering but before pagination

**Frontend Implementation**:
- Dropdown selector for sort options
- Sort state maintained independently
- Sort changes trigger data refetch
- Sort state persists across pagination

**Performance**: Database-level sorting ensures efficient execution even with large result sets.

## Pagination Implementation Summary

Pagination ensures **efficient data loading** with 10 items per page and maintains all active states.

**Backend Implementation**:
- Uses SQLAlchemy's `offset()` and `limit()` for pagination
- Calculates total count before pagination
- Returns pagination metadata:
  - Current page
  - Total pages
  - Total count
  - Has next/previous flags

**Frontend Implementation**:
- Previous/Next navigation buttons
- Page information display (Page X of Y)
- Disabled state for buttons at boundaries
- Auto-scroll to top on page change
- Page resets to 1 when filters/search/sort change

**State Management**:
- Pagination state maintained independently
- All states (search, filters, sort, page) work together
- URL could be enhanced to include pagination state (future enhancement)

## ⚠️ Important: Deployment Note

**For deployment, PostgreSQL is required.** SQLite will not work in production deployments (serverless platforms, cloud hosting, etc.).

### 🚀 Deployment Guides

- **📖 Start Here**: `START_HERE_DEPLOYMENT.md` - Choose your deployment path
- **📚 Complete Guide**: `END_TO_END_DEPLOYMENT.md` - Step-by-step instructions
- **⚡ Quick Start**: `DEPLOYMENT_SUMMARY.md` - Fastest deployment path
- **✅ Checklist**: `DEPLOYMENT_CHECKLIST.md` - Track your progress
- **🔧 Troubleshooting**: `DEPLOYMENT_GUIDE.md` - Common issues and solutions

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Load data from CSV:
```bash
python src/utils/loadData.py ../truestate_assignment_dataset.csv
```

5. Start the server:
```bash
python src/index.py
```

Or using uvicorn:
```bash
uvicorn src.index:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Running Both Services

1. Start backend in one terminal:
```bash
cd backend
source venv/bin/activate
python src/index.py
```

2. Start frontend in another terminal:
```bash
cd frontend
npm run dev
```

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request/Response handling
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Utility functions
│   │   └── index.py          # Application entry point
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/            # Next.js pages
│   │   ├── services/         # API service layer
│   │   ├── utils/            # Utility functions
│   │   ├── hooks/            # Custom React hooks
│   │   └── styles/           # Global styles
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── architecture.md       # Architecture documentation
│
└── README.md                  # This file
```

## API Endpoints

### GET /api/sales/transactions
Get paginated transactions with search, filters, and sorting.

**Query Parameters:**
- `search` (optional): Search by customer name or phone number
- `customer_regions` (optional): Comma-separated list of regions
- `genders` (optional): Comma-separated list of genders
- `age_min` (optional): Minimum age
- `age_max` (optional): Maximum age
- `product_categories` (optional): Comma-separated list of categories
- `tags` (optional): Comma-separated list of tags
- `payment_methods` (optional): Comma-separated list of payment methods
- `date_from` (optional): Start date (YYYY-MM-DD)
- `date_to` (optional): End date (YYYY-MM-DD)
- `sort_by` (optional): Sort option
- `page` (default: 1): Page number
- `page_size` (default: 10): Items per page



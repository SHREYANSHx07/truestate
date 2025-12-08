# Backend - Retail Sales Management System

## Overview
FastAPI-based backend for the Retail Sales Management System providing RESTful APIs for search, filtering, sorting, and pagination of sales transactions.

## Tech Stack
- **Framework**: FastAPI
- **Database**: SQLite (can be easily switched to PostgreSQL)
- **ORM**: SQLAlchemy
- **Data Processing**: Pandas

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip

### Installation

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
# From backend directory
python -m src.utils.loadData ../../truestate_assignment_dataset.csv
```

5. Start the server:
```bash
python src/index.py
```

Or using uvicorn directly:
```bash
uvicorn src.index:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation (Swagger UI) is available at `http://localhost:8000/docs`

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
- `sort_by` (optional): Sort option (date_desc, date_asc, quantity_desc, quantity_asc, customer_name_asc, customer_name_desc)
- `page` (default: 1): Page number
- `page_size` (default: 10): Items per page

### GET /api/sales/filter-options
Get available filter options for dropdowns.

## Project Structure
```
backend/
├── src/
│   ├── controllers/     # Request/Response handling
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.py         # Application entry point
├── requirements.txt
└── README.md
```


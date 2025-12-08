# Architecture Documentation

## Overview
The Retail Sales Management System is a full-stack application built with FastAPI (backend) and Next.js (frontend). The system provides comprehensive search, filtering, sorting, and pagination capabilities for managing sales transactions.

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI (Python)
- **Database**: SQLite (easily switchable to PostgreSQL)
- **ORM**: SQLAlchemy
- **Data Processing**: Pandas

### Architecture Pattern
The backend follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────────────────────────┐
│         API Layer (Routes)          │
│    - Request/Response handling      │
│    - Input validation               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Controller Layer               │
│    - Request parsing                │
│    - Response formatting            │
│    - Error handling                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│    - Business logic                 │
│    - Data processing                │
│    - Query building                 │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Model Layer (Database)          │
│    - Database models                │
│    - ORM mappings                   │
└─────────────────────────────────────┘
```

### Folder Structure
```
backend/
├── src/
│   ├── controllers/          # Request/Response handling
│   │   └── salesController.py
│   ├── services/             # Business logic layer
│   │   └── salesService.py
│   ├── models/               # Database models
│   │   └── database.py
│   ├── routes/               # API route definitions
│   │   └── api.py
│   ├── utils/                # Utility functions
│   │   └── loadData.py
│   └── index.py              # Application entry point
├── requirements.txt
└── README.md
```

### Module Responsibilities

#### Controllers (`controllers/salesController.py`)
- **Purpose**: Handle HTTP requests and responses
- **Responsibilities**:
  - Parse query parameters
  - Validate input data
  - Format API responses
  - Handle errors and exceptions
  - Convert database models to Pydantic models

#### Services (`services/salesService.py`)
- **Purpose**: Implement business logic
- **Responsibilities**:
  - Build complex database queries
  - Apply search filters
  - Implement sorting logic
  - Handle pagination
  - Process filter combinations
  - Extract filter options from database

#### Models (`models/database.py`)
- **Purpose**: Define database schema and connections
- **Responsibilities**:
  - Define SQLAlchemy models
  - Manage database connections
  - Provide database session management
  - Initialize database tables

#### Routes (`routes/api.py`)
- **Purpose**: Define API endpoints
- **Responsibilities**:
  - Register route handlers
  - Organize API structure
  - Apply middleware

#### Utils (`utils/loadData.py`)
- **Purpose**: Data loading utilities
- **Responsibilities**:
  - Load CSV data into database
  - Handle large file processing
  - Data validation and cleaning

### Data Flow

1. **Request Flow**:
   ```
   Client Request → FastAPI Router → Controller → Service → Database → Service → Controller → Response
   ```

2. **Search Flow**:
   - User enters search term
   - Controller receives search parameter
   - Service builds SQL query with LIKE conditions
   - Database executes query
   - Results filtered and returned

3. **Filter Flow**:
   - User selects multiple filters
   - Controller parses filter parameters
   - Service builds AND conditions for all active filters
   - Database executes filtered query
   - Results returned

4. **Sorting Flow**:
   - User selects sort option
   - Service applies ORDER BY clause
   - Database returns sorted results

5. **Pagination Flow**:
   - Service calculates offset and limit
   - Database returns paginated results
   - Service calculates pagination metadata

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 (React)
- **Language**: TypeScript
- **Styling**: CSS-in-JS (styled-jsx)
- **HTTP Client**: Axios

### Architecture Pattern
The frontend follows a **component-based architecture** with separation of concerns:

```
┌─────────────────────────────────────┐
│         Page Layer                  │
│    - Page components                │
│    - State management               │
│    - Data fetching                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Component Layer                │
│    - Reusable UI components        │
│    - Presentational components     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│    - API calls                      │
│    - Data transformation            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Backend API                    │
└─────────────────────────────────────┘
```

### Folder Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── TransactionTable.tsx
│   │   ├── SortingDropdown.tsx
│   │   └── Pagination.tsx
│   ├── pages/              # Next.js pages
│   │   ├── index.tsx
│   │   └── _app.tsx
│   ├── services/           # API service layer
│   │   └── api.ts
│   ├── utils/              # Utility functions
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Global styles
├── public/                 # Static assets
├── package.json
└── README.md
```

### Component Responsibilities

#### Pages (`pages/index.tsx`)
- **Purpose**: Main application page
- **Responsibilities**:
  - Manage global state (search, filters, sort, pagination)
  - Coordinate component interactions
  - Fetch data from API
  - Handle loading states
  - Layout structure

#### Components

**SearchBar** (`components/SearchBar.tsx`)
- Handles search input
- Implements debouncing (300ms)
- Notifies parent of search changes

**FilterPanel** (`components/FilterPanel.tsx`)
- Displays all filter options
- Manages multi-select filters
- Handles range inputs (age, date)
- Provides clear all functionality

**TransactionTable** (`components/TransactionTable.tsx`)
- Displays transactions in table format
- Handles empty states
- Shows loading state
- Formats data for display

**SortingDropdown** (`components/SortingDropdown.tsx`)
- Provides sort options
- Handles sort selection
- Updates parent state

**Pagination** (`components/Pagination.tsx`)
- Displays pagination controls
- Handles page navigation
- Shows page information

#### Services (`services/api.ts`)
- **Purpose**: API communication layer
- **Responsibilities**:
  - Define API endpoints
  - Handle HTTP requests
  - Transform request/response data
  - Type definitions
  - Error handling

### State Management

The application uses **React hooks** for state management:

1. **Local State** (useState):
   - Search term
   - Filter selections
   - Sort option
   - Current page
   - Loading state

2. **Effects** (useEffect):
   - Load filter options on mount
   - Fetch transactions when dependencies change
   - Reset page on filter/search/sort changes

3. **Callbacks** (useCallback):
   - Memoized data fetching function
   - Prevents unnecessary re-renders

### Data Flow

1. **Initial Load**:
   ```
   Component Mount → Load Filter Options → Display Filters
   ```

2. **User Interaction**:
   ```
   User Action → Update State → useEffect Trigger → API Call → Update UI
   ```

3. **Search Flow**:
   ```
   User Types → Debounce (300ms) → Update Search State → Fetch Transactions → Display Results
   ```

4. **Filter Flow**:
   ```
   User Selects Filter → Update Filter State → Reset to Page 1 → Fetch Transactions → Display Results
   ```

5. **Pagination Flow**:
   ```
   User Clicks Next/Previous → Update Page State → Fetch Transactions → Scroll to Top → Display Results
   ```

## Integration

### API Communication
- **Protocol**: HTTP/REST
- **Format**: JSON
- **Base URL**: Configurable via environment variable
- **CORS**: Enabled for frontend origins

### Error Handling
- **Backend**: HTTP status codes with error messages
- **Frontend**: Try-catch blocks with user-friendly error messages
- **Network Errors**: Graceful degradation

### Performance Optimizations

**Backend**:
- Database indexes on frequently queried fields
- Efficient SQL queries with proper joins
- Pagination to limit result sets
- Query optimization for large datasets

**Frontend**:
- Debounced search to reduce API calls
- Memoized callbacks to prevent re-renders
- Efficient state updates
- Lazy loading of components (if needed)

## Database Schema

### SalesTransaction Table
- **Primary Key**: transaction_id
- **Indexed Fields**: 
  - date, customer_id, customer_name, phone_number
  - gender, age, customer_region, product_category
  - tags, quantity, payment_method
- **Data Types**: Appropriate types for each field (String, Integer, Float, Date)

## Security Considerations

1. **Input Validation**: Pydantic models validate all inputs
2. **SQL Injection**: SQLAlchemy ORM prevents SQL injection
3. **CORS**: Configured for specific origins
4. **Error Messages**: Generic error messages to prevent information leakage

## Scalability

### Current Implementation
- SQLite for development (1M+ rows)
- Efficient queries with indexes
- Pagination to handle large result sets

### Future Enhancements
- Switch to PostgreSQL for production
- Add caching layer (Redis)
- Implement database connection pooling
- Add API rate limiting
- Consider Elasticsearch for advanced search

## Deployment Considerations

### Backend
- Use production ASGI server (Gunicorn with Uvicorn workers)
- Environment variables for configuration
- Database migrations
- Health check endpoints

### Frontend
- Static export or SSR based on requirements
- Environment variables for API URL
- Build optimization
- CDN for static assets


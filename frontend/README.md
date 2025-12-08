# Frontend - Retail Sales Management System

## Overview
Next.js-based frontend for the Retail Sales Management System providing an intuitive UI for searching, filtering, sorting, and paginating sales transactions.

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: CSS-in-JS (styled-jsx)
- **HTTP Client**: Axios

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file (optional, defaults to localhost:8000):
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

### Search
- Real-time search with debouncing (300ms)
- Case-insensitive search on Customer Name and Phone Number

### Filters
- Multi-select filters for:
  - Customer Region
  - Gender
  - Age Range (min/max)
  - Product Category
  - Tags
  - Payment Method
  - Date Range
- Filters work independently and in combination
- Clear all filters button

### Sorting
- Sort by:
  - Date (Newest/Oldest First)
  - Quantity (High to Low / Low to High)
  - Customer Name (A-Z / Z-A)

### Pagination
- 10 items per page
- Previous/Next navigation
- Page information display
- Maintains all filter/search/sort states

## Project Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Next.js pages
│   ├── services/        # API service layer
│   ├── utils/           # Utility functions
│   ├── hooks/           # Custom React hooks
│   └── styles/          # Global styles
├── public/              # Static assets
├── package.json
└── README.md
```


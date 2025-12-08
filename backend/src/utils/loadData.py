"""
Script to load CSV data into SQLite database
"""
import pandas as pd
from sqlalchemy import create_engine
from datetime import datetime
import os
import sys

# Add backend/src to path for imports
backend_src = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(backend_src, 'src'))

from models.database import Base, SalesTransaction, DATABASE_URL

def load_csv_to_db(csv_path):
    """Load CSV data into database"""
    print(f"Loading data from {csv_path}...")
    
    # Create database tables
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    # Read CSV in chunks to handle large files
    # Use smaller chunks for SQLite (it has a limit of ~999 SQL variables)
    chunk_size = 500 if "sqlite" in DATABASE_URL else 10000
    total_rows = 0
    
    try:
        for chunk in pd.read_csv(csv_path, chunksize=chunk_size):
            # Clean and prepare data
            chunk['Date'] = pd.to_datetime(chunk['Date'], errors='coerce')
            chunk = chunk.dropna(subset=['Date'])  # Remove rows with invalid dates
            
            # Rename columns to match database model
            chunk.rename(columns={
                'Transaction ID': 'transaction_id',
                'Date': 'date',
                'Customer ID': 'customer_id',
                'Customer Name': 'customer_name',
                'Phone Number': 'phone_number',
                'Gender': 'gender',
                'Age': 'age',
                'Customer Region': 'customer_region',
                'Customer Type': 'customer_type',
                'Product ID': 'product_id',
                'Product Name': 'product_name',
                'Brand': 'brand',
                'Product Category': 'product_category',
                'Tags': 'tags',
                'Quantity': 'quantity',
                'Price per Unit': 'price_per_unit',
                'Discount Percentage': 'discount_percentage',
                'Total Amount': 'total_amount',
                'Final Amount': 'final_amount',
                'Payment Method': 'payment_method',
                'Order Status': 'order_status',
                'Delivery Type': 'delivery_type',
                'Store ID': 'store_id',
                'Store Location': 'store_location',
                'Salesperson ID': 'salesperson_id',
                'Employee Name': 'employee_name'
            }, inplace=True)
            
            # Convert date to datetime
            chunk['date'] = pd.to_datetime(chunk['date']).dt.date
            
            # Insert into database
            # For SQLite, use None method (row-by-row) to avoid SQL variable limit
            method = None if "sqlite" in DATABASE_URL else 'multi'
            chunk.to_sql(
                'sales_transactions',
                engine,
                if_exists='append',
                index=False,
                method=method
            )
            
            total_rows += len(chunk)
            if total_rows % 10000 == 0:
                print(f"Loaded {total_rows} rows...")
        
        print(f"Successfully loaded {total_rows} rows into database!")
        
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        raise

if __name__ == "__main__":
    # Get CSV path from command line or use default
    csv_path = sys.argv[1] if len(sys.argv) > 1 else "../../truestate_assignment_dataset.csv"
    
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        sys.exit(1)
    
    load_csv_to_db(csv_path)


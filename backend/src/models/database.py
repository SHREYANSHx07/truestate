from sqlalchemy import create_engine, Column, Integer, String, Float, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool, StaticPool
from datetime import datetime
import os

# Database setup
# Supports both SQLite (default) and PostgreSQL
# To use PostgreSQL, set: DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sales_data.db")

# Configure engine based on database type
if "sqlite" in DATABASE_URL:
    # SQLite configuration
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 20},
        poolclass=StaticPool,
        pool_pre_ping=True
    )
else:
    # PostgreSQL configuration with connection pooling
    engine = create_engine(
        DATABASE_URL,
        poolclass=QueuePool,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,  # Verify connections before using
        echo=False  # Set to True for SQL query logging
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class SalesTransaction(Base):
    __tablename__ = "sales_transactions"

    transaction_id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    customer_id = Column(String, index=True)
    customer_name = Column(String, index=True)
    phone_number = Column(String, index=True)
    gender = Column(String, index=True)
    age = Column(Integer, index=True)
    customer_region = Column(String, index=True)
    customer_type = Column(String)
    product_id = Column(String, index=True)
    product_name = Column(String)
    brand = Column(String)
    product_category = Column(String, index=True)
    tags = Column(String, index=True)
    quantity = Column(Integer, index=True)
    price_per_unit = Column(Float)
    discount_percentage = Column(Float)
    total_amount = Column(Float)
    final_amount = Column(Float)
    payment_method = Column(String, index=True)
    order_status = Column(String)
    delivery_type = Column(String)
    store_id = Column(String)
    store_location = Column(String)
    salesperson_id = Column(String)
    employee_name = Column(String)


def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


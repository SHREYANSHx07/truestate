"""
Sales Controller - Request/Response handling
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models.database import get_db
from services.salesService import SalesService
from pydantic import BaseModel
from datetime import date


class TransactionResponse(BaseModel):
    transaction_id: int
    date: date
    customer_id: str
    customer_name: str
    phone_number: str
    gender: str
    age: int
    customer_region: str
    customer_type: str
    product_id: str
    product_name: str
    brand: str
    product_category: str
    tags: str
    quantity: int
    price_per_unit: float
    discount_percentage: float
    total_amount: float
    final_amount: float
    payment_method: str
    order_status: str
    delivery_type: str
    store_id: str
    store_location: str
    salesperson_id: str
    employee_name: str

    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    transactions: List[TransactionResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


class FilterOptionsResponse(BaseModel):
    regions: List[str]
    genders: List[str]
    categories: List[str]
    tags: List[str]
    payment_methods: List[str]
    age_range: dict


router = APIRouter()


@router.get("/transactions", response_model=PaginatedResponse)
async def get_transactions(
    search: Optional[str] = Query(None, description="Search by customer name or phone number"),
    customer_regions: Optional[str] = Query(None, description="Comma-separated list of regions"),
    genders: Optional[str] = Query(None, description="Comma-separated list of genders"),
    age_min: Optional[int] = Query(None, description="Minimum age"),
    age_max: Optional[int] = Query(None, description="Maximum age"),
    product_categories: Optional[str] = Query(None, description="Comma-separated list of categories"),
    tags: Optional[str] = Query(None, description="Comma-separated list of tags"),
    payment_methods: Optional[str] = Query(None, description="Comma-separated list of payment methods"),
    date_from: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    sort_by: Optional[str] = Query("date_desc", description="Sort by: date_desc, date_asc, quantity_desc, quantity_asc, customer_name_asc, customer_name_desc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """
    Get transactions with search, filters, sorting, and pagination
    """
    try:
        # Parse comma-separated filter values
        regions_list = customer_regions.split(",") if customer_regions else None
        genders_list = genders.split(",") if genders else None
        categories_list = product_categories.split(",") if product_categories else None
        tags_list = tags.split(",") if tags else None
        payment_methods_list = payment_methods.split(",") if payment_methods else None
        
        # Clean up filter lists (remove empty strings)
        if regions_list:
            regions_list = [r.strip() for r in regions_list if r.strip()]
        if genders_list:
            genders_list = [g.strip() for g in genders_list if g.strip()]
        if categories_list:
            categories_list = [c.strip() for c in categories_list if c.strip()]
        if tags_list:
            tags_list = [t.strip() for t in tags_list if t.strip()]
        if payment_methods_list:
            payment_methods_list = [p.strip() for p in payment_methods_list if p.strip()]
        
        result = SalesService.get_transactions(
            db=db,
            search=search,
            customer_regions=regions_list,
            genders=genders_list,
            age_min=age_min,
            age_max=age_max,
            product_categories=categories_list,
            tags=tags_list,
            payment_methods=payment_methods_list,
            date_from=date_from,
            date_to=date_to,
            sort_by=sort_by,
            page=page,
            page_size=page_size
        )
        
        return {
            "transactions": result["transactions"],
            "total_count": result["total_count"],
            "page": result["page"],
            "page_size": result["page_size"],
            "total_pages": result["total_pages"],
            "has_next": result["has_next"],
            "has_previous": result["has_previous"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/filter-options", response_model=FilterOptionsResponse)
async def get_filter_options(db: Session = Depends(get_db)):
    """
    Get available filter options
    """
    try:
        options = SalesService.get_filter_options(db)
        return options
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


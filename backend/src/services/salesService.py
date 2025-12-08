"""
Sales Service - Business logic for sales transactions
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc
from datetime import datetime, date
from typing import List, Optional, Dict, Any
from models.database import SalesTransaction


class SalesService:
    @staticmethod
    def get_transactions(
        db: Session,
        search: Optional[str] = None,
        customer_regions: Optional[List[str]] = None,
        genders: Optional[List[str]] = None,
        age_min: Optional[int] = None,
        age_max: Optional[int] = None,
        product_categories: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        payment_methods: Optional[List[str]] = None,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None,
        sort_by: Optional[str] = None,
        page: int = 1,
        page_size: int = 10
    ) -> Dict[str, Any]:
        """
        Get transactions with search, filters, sorting, and pagination
        """
        # Start with base query
        query = db.query(SalesTransaction)
        
        # Apply search (case-insensitive)
        if search:
            search_term = f"%{search.lower()}%"
            query = query.filter(
                or_(
                    func.lower(SalesTransaction.customer_name).like(search_term),
                    SalesTransaction.phone_number.like(search_term)
                )
            )
        
        # Apply filters
        filters = []
        
        if customer_regions:
            filters.append(SalesTransaction.customer_region.in_(customer_regions))
        
        if genders:
            filters.append(SalesTransaction.gender.in_(genders))
        
        if age_min is not None:
            filters.append(SalesTransaction.age >= age_min)
        
        if age_max is not None:
            filters.append(SalesTransaction.age <= age_max)
        
        if product_categories:
            filters.append(SalesTransaction.product_category.in_(product_categories))
        
        if tags:
            # Tags are comma-separated, so we need to check if any tag matches
            tag_filters = []
            for tag in tags:
                tag_filters.append(SalesTransaction.tags.like(f"%{tag}%"))
            if tag_filters:
                filters.append(or_(*tag_filters))
        
        if payment_methods:
            filters.append(SalesTransaction.payment_method.in_(payment_methods))
        
        if date_from:
            try:
                date_from_obj = datetime.strptime(date_from, "%Y-%m-%d").date()
                filters.append(SalesTransaction.date >= date_from_obj)
            except ValueError:
                pass
        
        if date_to:
            try:
                date_to_obj = datetime.strptime(date_to, "%Y-%m-%d").date()
                filters.append(SalesTransaction.date <= date_to_obj)
            except ValueError:
                pass
        
        # Apply all filters
        if filters:
            query = query.filter(and_(*filters))
        
        # Get total count before pagination
        total_count = query.count()
        
        # Apply sorting
        if sort_by == "date_desc":
            query = query.order_by(desc(SalesTransaction.date))
        elif sort_by == "date_asc":
            query = query.order_by(asc(SalesTransaction.date))
        elif sort_by == "quantity_desc":
            query = query.order_by(desc(SalesTransaction.quantity))
        elif sort_by == "quantity_asc":
            query = query.order_by(asc(SalesTransaction.quantity))
        elif sort_by == "customer_name_asc":
            query = query.order_by(asc(SalesTransaction.customer_name))
        elif sort_by == "customer_name_desc":
            query = query.order_by(desc(SalesTransaction.customer_name))
        else:
            # Default: newest first
            query = query.order_by(desc(SalesTransaction.date))
        
        # Apply pagination
        offset = (page - 1) * page_size
        transactions = query.offset(offset).limit(page_size).all()
        
        # Calculate pagination info
        total_pages = (total_count + page_size - 1) // page_size
        
        return {
            "transactions": transactions,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    
    @staticmethod
    def get_filter_options(db: Session) -> Dict[str, List[str]]:
        """
        Get available filter options for dropdowns
        """
        # Get distinct values for each filter field
        regions = db.query(SalesTransaction.customer_region).distinct().all()
        genders = db.query(SalesTransaction.gender).distinct().all()
        categories = db.query(SalesTransaction.product_category).distinct().all()
        payment_methods = db.query(SalesTransaction.payment_method).distinct().all()
        
        # Get all tags (comma-separated, need to extract unique)
        all_tags = db.query(SalesTransaction.tags).distinct().all()
        unique_tags = set()
        for tag_row in all_tags:
            if tag_row[0]:
                tag_list = [t.strip() for t in tag_row[0].split(",")]
                unique_tags.update(tag_list)
        
        # Get age range
        age_stats = db.query(
            func.min(SalesTransaction.age).label("min_age"),
            func.max(SalesTransaction.age).label("max_age")
        ).first()
        
        return {
            "regions": sorted([r[0] for r in regions if r[0]]),
            "genders": sorted([g[0] for g in genders if g[0]]),
            "categories": sorted([c[0] for c in categories if c[0]]),
            "tags": sorted(list(unique_tags)),
            "payment_methods": sorted([p[0] for p in payment_methods if p[0]]),
            "age_range": {
                "min": age_stats.min_age if age_stats else 0,
                "max": age_stats.max_age if age_stats else 100
            }
        }


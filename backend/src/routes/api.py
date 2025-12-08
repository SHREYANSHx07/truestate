"""
API Routes
"""
from fastapi import APIRouter
from controllers.salesController import router as sales_router

api_router = APIRouter()

api_router.include_router(sales_router, prefix="/sales", tags=["sales"])


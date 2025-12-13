"""
Sweet management and inventory routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, Sweet
from app.schemas import (
    SweetCreate,
    SweetUpdate,
    SweetResponse,
    PurchaseRequest,
    RestockRequest,
    InventoryResponse
)
from app.security import get_current_user, get_current_admin_user

router = APIRouter()


# ========== Sweet CRUD Operations ==========

@router.post("", response_model=SweetResponse, status_code=status.HTTP_201_CREATED)
async def create_sweet(
    sweet_data: SweetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Create a new sweet (Admin only)
    
    - **name**: Sweet name
    - **category**: Category (e.g., candy, chocolate, gummy)
    - **price**: Price in dollars
    - **quantity**: Initial stock quantity
    - **description**: Optional description
    - **image_url**: Optional image URL
    """
    new_sweet = Sweet(**sweet_data.dict())
    
    db.add(new_sweet)
    db.commit()
    db.refresh(new_sweet)
    
    return new_sweet


@router.get("", response_model=List[SweetResponse])
async def get_all_sweets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    in_stock_only: bool = Query(False)
):
    """
    Get all sweets
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **in_stock_only**: Filter to show only sweets in stock
    """
    query = db.query(Sweet).filter(Sweet.is_active == True)
    
    if in_stock_only:
        query = query.filter(Sweet.quantity > 0)
    
    sweets = query.offset(skip).limit(limit).all()
    return sweets


@router.get("/search", response_model=List[SweetResponse])
async def search_sweets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    name: Optional[str] = Query(None, min_length=1),
    category: Optional[str] = Query(None, min_length=1),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    in_stock_only: bool = Query(True)
):
    """
    Search sweets by name, category, or price range
    
    - **name**: Search by sweet name (partial match, case-insensitive)
    - **category**: Filter by category (partial match, case-insensitive)
    - **min_price**: Minimum price filter
    - **max_price**: Maximum price filter
    - **in_stock_only**: Show only sweets in stock (default: true)
    """
    query = db.query(Sweet).filter(Sweet.is_active == True)
    
    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    
    if category:
        query = query.filter(Sweet.category.ilike(f"%{category}%"))
    
    if min_price is not None:
        query = query.filter(Sweet.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Sweet.price <= max_price)
    
    if in_stock_only:
        query = query.filter(Sweet.quantity > 0)
    
    sweets = query.all()
    return sweets


@router.get("/{sweet_id}", response_model=SweetResponse)
async def get_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific sweet by ID
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id, Sweet.is_active == True).first()
    
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sweet with ID {sweet_id} not found"
        )
    
    return sweet


@router.put("/{sweet_id}", response_model=SweetResponse)
async def update_sweet(
    sweet_id: int,
    sweet_data: SweetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Update a sweet's details (Admin only)
    
    All fields are optional. Only provided fields will be updated.
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sweet with ID {sweet_id} not found"
        )
    
    # Update only provided fields
    update_data = sweet_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sweet, field, value)
    
    db.commit()
    db.refresh(sweet)
    
    return sweet


@router.delete("/{sweet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Delete a sweet (Admin only)
    
    This performs a soft delete by setting is_active to False
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sweet with ID {sweet_id} not found"
        )
    
    sweet.is_active = False
    db.commit()
    
    return None


# ========== Inventory Operations ==========

@router.post("/{sweet_id}/purchase", response_model=InventoryResponse)
async def purchase_sweet(
    sweet_id: int,
    purchase_data: PurchaseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Purchase a sweet (decreases quantity)
    
    - **quantity**: Number of units to purchase (must be > 0)
    
    Returns updated sweet information
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id, Sweet.is_active == True).first()
    
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sweet with ID {sweet_id} not found"
        )
    
    if not sweet.is_in_stock():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Sweet '{sweet.name}' is out of stock"
        )
    
    if not sweet.can_purchase(purchase_data.quantity):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {sweet.quantity}, Requested: {purchase_data.quantity}"
        )
    
    # Update quantity
    sweet.quantity -= purchase_data.quantity
    db.commit()
    db.refresh(sweet)
    
    return {
        "success": True,
        "message": f"Successfully purchased {purchase_data.quantity} units of {sweet.name}",
        "sweet": sweet
    }


@router.post("/{sweet_id}/restock", response_model=InventoryResponse)
async def restock_sweet(
    sweet_id: int,
    restock_data: RestockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """
    Restock a sweet (Admin only - increases quantity)
    
    - **quantity**: Number of units to add to stock (must be > 0)
    
    Returns updated sweet information
    """
    sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    
    if not sweet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sweet with ID {sweet_id} not found"
        )
    
    # Update quantity
    sweet.quantity += restock_data.quantity
    sweet.is_active = True  # Reactivate if was inactive
    db.commit()
    db.refresh(sweet)
    
    return {
        "success": True,
        "message": f"Successfully restocked {restock_data.quantity} units of {sweet.name}",
        "sweet": sweet
    }

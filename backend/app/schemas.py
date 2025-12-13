"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from app.models import UserRole


# ========== Auth Schemas ==========

class UserRegister(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: str = Field(..., min_length=2, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        """Validate password strength"""
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data"""
    email: Optional[str] = None
    user_id: Optional[int] = None
    role: Optional[str] = None


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    email: str
    name: str
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========== Sweet Schemas ==========

class SweetCreate(BaseModel):
    """Schema for creating a sweet"""
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0, le=10000)
    quantity: int = Field(..., ge=0, le=1000000)
    description: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = Field(None, max_length=500)


class SweetUpdate(BaseModel):
    """Schema for updating a sweet"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0, le=10000)
    quantity: Optional[int] = Field(None, ge=0, le=1000000)
    description: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = Field(None, max_length=500)
    is_active: Optional[bool] = None


class SweetResponse(BaseModel):
    """Schema for sweet response"""
    id: int
    name: str
    category: str
    price: float
    quantity: int
    description: Optional[str]
    image_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class SweetSearchParams(BaseModel):
    """Schema for sweet search parameters"""
    name: Optional[str] = None
    category: Optional[str] = None
    min_price: Optional[float] = Field(None, ge=0)
    max_price: Optional[float] = Field(None, ge=0)
    in_stock_only: bool = True


# ========== Inventory Schemas ==========

class PurchaseRequest(BaseModel):
    """Schema for purchasing sweets"""
    quantity: int = Field(..., gt=0, le=1000)


class RestockRequest(BaseModel):
    """Schema for restocking sweets"""
    quantity: int = Field(..., gt=0, le=1000000)


class InventoryResponse(BaseModel):
    """Schema for inventory operation response"""
    success: bool
    message: str
    sweet: SweetResponse

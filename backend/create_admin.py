"""
Create admin user for the Sweet Shop Management System
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import User, UserRole
from app.security import get_password_hash
from app.config import settings


def create_admin_user():
    """Create admin user if it doesn't exist"""
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        
        if existing_admin:
            print(f"❌ Admin user already exists: {settings.ADMIN_EMAIL}")
            return
        
        # Create admin user
        admin = User(
            email=settings.ADMIN_EMAIL,
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            name=settings.ADMIN_NAME,
            role=UserRole.ADMIN,
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print("✅ Admin user created successfully!")
        print(f"   Email: {admin.email}")
        print(f"   Password: {settings.ADMIN_PASSWORD}")
        print(f"   Role: {admin.role.value}")
        print("\n⚠️  Please change the admin password after first login!")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    create_admin_user()

"""
Seed database with sample sweets for testing
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Sweet


def seed_sweets():
    """Seed database with sample sweets"""
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    try:
        # Check if sweets already exist
        existing_sweets = db.query(Sweet).count()
        
        if existing_sweets > 0:
            print(f"❌ Database already contains {existing_sweets} sweets")
            return
        
        # Sample sweets data
        sample_sweets = [
            {
                "name": "Milk Chocolate Bar",
                "category": "chocolate",
                "price": 2.99,
                "quantity": 100,
                "description": "Classic smooth milk chocolate",
                "image_url": "https://via.placeholder.com/200x200/8B4513/ffffff?text=Chocolate"
            },
            {
                "name": "Dark Chocolate Bar",
                "category": "chocolate",
                "price": 3.49,
                "quantity": 75,
                "description": "Rich 70% dark chocolate",
                "image_url": "https://via.placeholder.com/200x200/4B3621/ffffff?text=Dark+Choco"
            },
            {
                "name": "Gummy Bears",
                "category": "gummy",
                "price": 1.99,
                "quantity": 200,
                "description": "Assorted fruity gummy bears",
                "image_url": "https://via.placeholder.com/200x200/FF6B6B/ffffff?text=Gummy+Bears"
            },
            {
                "name": "Gummy Worms",
                "category": "gummy",
                "price": 2.49,
                "quantity": 150,
                "description": "Sour gummy worms",
                "image_url": "https://via.placeholder.com/200x200/4ECDC4/ffffff?text=Gummy+Worms"
            },
            {
                "name": "Lollipops",
                "category": "candy",
                "price": 0.99,
                "quantity": 300,
                "description": "Colorful fruit-flavored lollipops",
                "image_url": "https://via.placeholder.com/200x200/FFD93D/ffffff?text=Lollipop"
            },
            {
                "name": "Candy Canes",
                "category": "candy",
                "price": 1.49,
                "quantity": 120,
                "description": "Peppermint candy canes",
                "image_url": "https://via.placeholder.com/200x200/FF6B9D/ffffff?text=Candy+Cane"
            },
            {
                "name": "Jelly Beans",
                "category": "candy",
                "price": 3.99,
                "quantity": 180,
                "description": "Assorted gourmet jelly beans",
                "image_url": "https://via.placeholder.com/200x200/A8E6CF/ffffff?text=Jelly+Beans"
            },
            {
                "name": "Marshmallows",
                "category": "candy",
                "price": 2.29,
                "quantity": 90,
                "description": "Soft and fluffy marshmallows",
                "image_url": "https://via.placeholder.com/200x200/FFDAC1/ffffff?text=Marshmallow"
            },
            {
                "name": "Licorice Twists",
                "category": "candy",
                "price": 1.79,
                "quantity": 85,
                "description": "Classic black licorice twists",
                "image_url": "https://via.placeholder.com/200x200/2C3E50/ffffff?text=Licorice"
            },
            {
                "name": "Mint Chocolates",
                "category": "chocolate",
                "price": 4.99,
                "quantity": 60,
                "description": "Premium chocolate with mint filling",
                "image_url": "https://via.placeholder.com/200x200/16A085/ffffff?text=Mint+Choco"
            },
            {
                "name": "Caramel Chews",
                "category": "candy",
                "price": 2.99,
                "quantity": 110,
                "description": "Soft caramel candy chews",
                "image_url": "https://via.placeholder.com/200x200/D4A574/ffffff?text=Caramel"
            },
            {
                "name": "Sour Patch Kids",
                "category": "gummy",
                "price": 2.79,
                "quantity": 140,
                "description": "Sour then sweet gummy candy",
                "image_url": "https://via.placeholder.com/200x200/F39C12/ffffff?text=Sour+Patch"
            }
        ]
        
        # Create sweets
        for sweet_data in sample_sweets:
            sweet = Sweet(**sweet_data)
            db.add(sweet)
        
        db.commit()
        
        print(f"✅ Successfully seeded {len(sample_sweets)} sweets!")
        print("\nSample Sweets Added:")
        for i, sweet_data in enumerate(sample_sweets, 1):
            print(f"   {i}. {sweet_data['name']} - ${sweet_data['price']} ({sweet_data['quantity']} in stock)")
        
    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    seed_sweets()

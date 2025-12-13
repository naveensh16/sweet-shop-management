"""
Test configuration and fixtures
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.models import User, Sweet, UserRole
from app.security import get_password_hash

# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test"""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client"""
    return TestClient(app)


@pytest.fixture
def test_user(db_session):
    """Create a test user"""
    user = User(
        email="testuser@example.com",
        hashed_password=get_password_hash("TestPassword123!"),
        name="Test User",
        role=UserRole.USER,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_admin(db_session):
    """Create a test admin user"""
    admin = User(
        email="admin@example.com",
        hashed_password=get_password_hash("AdminPassword123!"),
        name="Admin User",
        role=UserRole.ADMIN,
        is_active=True
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin


@pytest.fixture
def test_sweet(db_session):
    """Create a test sweet"""
    sweet = Sweet(
        name="Chocolate Bar",
        category="chocolate",
        price=2.99,
        quantity=100,
        description="Delicious milk chocolate",
        is_active=True
    )
    db_session.add(sweet)
    db_session.commit()
    db_session.refresh(sweet)
    return sweet


@pytest.fixture
def user_token(client, test_user):
    """Get JWT token for test user"""
    response = client.post(
        "/api/auth/login",
        data={
            "username": test_user.email,
            "password": "TestPassword123!"
        }
    )
    return response.json()["access_token"]


@pytest.fixture
def admin_token(client, test_admin):
    """Get JWT token for test admin"""
    response = client.post(
        "/api/auth/login",
        data={
            "username": test_admin.email,
            "password": "AdminPassword123!"
        }
    )
    return response.json()["access_token"]


@pytest.fixture
def auth_headers_user(user_token):
    """Get authorization headers for test user"""
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def auth_headers_admin(admin_token):
    """Get authorization headers for test admin"""
    return {"Authorization": f"Bearer {admin_token}"}

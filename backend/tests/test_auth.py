"""
Tests for authentication endpoints

Following TDD principles: Red-Green-Refactor
These tests were written BEFORE implementing the auth functionality
"""
import pytest
from fastapi import status


@pytest.mark.auth
class TestUserRegistration:
    """Test user registration endpoint"""
    
    def test_register_new_user_success(self, client):
        """
        TEST: Register a new user with valid data
        EXPECT: 201 Created with user data
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "newuser@example.com",
                "password": "SecurePass123!",
                "name": "New User"
            }
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["name"] == "New User"
        assert data["role"] == "user"
        assert "id" in data
        assert "hashed_password" not in data  # Should not expose password
    
    def test_register_duplicate_email(self, client, test_user):
        """
        TEST: Register with an already existing email
        EXPECT: 400 Bad Request
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": test_user.email,
                "password": "AnotherPass123!",
                "name": "Duplicate User"
            }
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already registered" in response.json()["detail"].lower()
    
    def test_register_invalid_email(self, client):
        """
        TEST: Register with invalid email format
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "invalid-email",
                "password": "SecurePass123!",
                "name": "Test User"
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_register_weak_password(self, client):
        """
        TEST: Register with weak password (no uppercase)
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "user@example.com",
                "password": "weakpass123",
                "name": "Test User"
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_register_short_password(self, client):
        """
        TEST: Register with password shorter than 8 characters
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            "/api/auth/register",
            json={
                "email": "user@example.com",
                "password": "Short1!",
                "name": "Test User"
            }
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.auth
class TestUserLogin:
    """Test user login endpoint"""
    
    def test_login_success(self, client, test_user):
        """
        TEST: Login with valid credentials
        EXPECT: 200 OK with JWT token
        """
        response = client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_wrong_password(self, client, test_user):
        """
        TEST: Login with incorrect password
        EXPECT: 401 Unauthorized
        """
        response = client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "WrongPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_nonexistent_user(self, client):
        """
        TEST: Login with non-existent email
        EXPECT: 401 Unauthorized
        """
        response = client.post(
            "/api/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "SomePassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_login_inactive_user(self, client, test_user, db_session):
        """
        TEST: Login with inactive user account
        EXPECT: 403 Forbidden
        """
        test_user.is_active = False
        db_session.commit()
        
        response = client.post(
            "/api/auth/login",
            data={
                "username": test_user.email,
                "password": "TestPassword123!"
            }
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.auth
class TestGetCurrentUser:
    """Test get current user endpoint"""
    
    def test_get_current_user_success(self, client, auth_headers_user, test_user):
        """
        TEST: Get current user info with valid token
        EXPECT: 200 OK with user data
        """
        response = client.get(
            "/api/auth/me",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["email"] == test_user.email
        assert data["name"] == test_user.name
        assert data["role"] == test_user.role.value
    
    def test_get_current_user_no_token(self, client):
        """
        TEST: Get current user without token
        EXPECT: 401 Unauthorized
        """
        response = client.get("/api/auth/me")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_current_user_invalid_token(self, client):
        """
        TEST: Get current user with invalid token
        EXPECT: 401 Unauthorized
        """
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid_token"}
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

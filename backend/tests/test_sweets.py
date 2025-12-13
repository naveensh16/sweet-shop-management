"""
Tests for sweet management endpoints

Following TDD principles: Red-Green-Refactor
"""
import pytest
from fastapi import status


@pytest.mark.sweets
class TestCreateSweet:
    """Test create sweet endpoint"""
    
    def test_create_sweet_as_admin_success(self, client, auth_headers_admin):
        """
        TEST: Admin creates a new sweet
        EXPECT: 201 Created with sweet data
        """
        response = client.post(
            "/api/sweets",
            json={
                "name": "Gummy Bears",
                "category": "gummy",
                "price": 1.99,
                "quantity": 200,
                "description": "Fruity gummy bears"
            },
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Gummy Bears"
        assert data["category"] == "gummy"
        assert data["price"] == 1.99
        assert data["quantity"] == 200
        assert "id" in data
    
    def test_create_sweet_as_user_forbidden(self, client, auth_headers_user):
        """
        TEST: Regular user tries to create a sweet
        EXPECT: 403 Forbidden
        """
        response = client.post(
            "/api/sweets",
            json={
                "name": "Candy Cane",
                "category": "candy",
                "price": 0.99,
                "quantity": 50
            },
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_create_sweet_unauthorized(self, client):
        """
        TEST: Create sweet without authentication
        EXPECT: 401 Unauthorized
        """
        response = client.post(
            "/api/sweets",
            json={
                "name": "Lollipop",
                "category": "candy",
                "price": 0.50,
                "quantity": 100
            }
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_sweet_invalid_price(self, client, auth_headers_admin):
        """
        TEST: Create sweet with negative price
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            "/api/sweets",
            json={
                "name": "Invalid Sweet",
                "category": "candy",
                "price": -5.99,
                "quantity": 10
            },
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.sweets
class TestGetSweets:
    """Test get sweets endpoints"""
    
    def test_get_all_sweets_success(self, client, auth_headers_user, test_sweet):
        """
        TEST: Get all sweets
        EXPECT: 200 OK with list of sweets
        """
        response = client.get(
            "/api/sweets",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert data[0]["name"] == test_sweet.name
    
    def test_get_all_sweets_unauthorized(self, client):
        """
        TEST: Get sweets without authentication
        EXPECT: 401 Unauthorized
        """
        response = client.get("/api/sweets")
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_get_all_sweets_in_stock_filter(self, client, auth_headers_user, db_session):
        """
        TEST: Get only sweets that are in stock
        EXPECT: 200 OK with filtered list
        """
        from app.models import Sweet
        
        # Create out-of-stock sweet
        out_of_stock = Sweet(
            name="Out of Stock Sweet",
            category="candy",
            price=3.99,
            quantity=0,
            is_active=True
        )
        db_session.add(out_of_stock)
        db_session.commit()
        
        response = client.get(
            "/api/sweets?in_stock_only=true",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        # All returned sweets should have quantity > 0
        for sweet in data:
            assert sweet["quantity"] > 0
    
    def test_get_sweet_by_id_success(self, client, auth_headers_user, test_sweet):
        """
        TEST: Get specific sweet by ID
        EXPECT: 200 OK with sweet data
        """
        response = client.get(
            f"/api/sweets/{test_sweet.id}",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == test_sweet.id
        assert data["name"] == test_sweet.name
    
    def test_get_sweet_by_id_not_found(self, client, auth_headers_user):
        """
        TEST: Get non-existent sweet
        EXPECT: 404 Not Found
        """
        response = client.get(
            "/api/sweets/99999",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.sweets
class TestSearchSweets:
    """Test sweet search endpoint"""
    
    def test_search_by_name(self, client, auth_headers_user, test_sweet):
        """
        TEST: Search sweets by name
        EXPECT: 200 OK with matching sweets
        """
        response = client.get(
            f"/api/sweets/search?name=Chocolate",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) > 0
        assert "Chocolate" in data[0]["name"]
    
    def test_search_by_category(self, client, auth_headers_user, test_sweet):
        """
        TEST: Search sweets by category
        EXPECT: 200 OK with matching sweets
        """
        response = client.get(
            f"/api/sweets/search?category=chocolate",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) > 0
        assert data[0]["category"] == "chocolate"
    
    def test_search_by_price_range(self, client, auth_headers_user, test_sweet):
        """
        TEST: Search sweets by price range
        EXPECT: 200 OK with sweets in price range
        """
        response = client.get(
            f"/api/sweets/search?min_price=2.00&max_price=5.00",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        for sweet in data:
            assert 2.00 <= sweet["price"] <= 5.00
    
    def test_search_combined_filters(self, client, auth_headers_user, test_sweet):
        """
        TEST: Search with multiple filters
        EXPECT: 200 OK with sweets matching all criteria
        """
        response = client.get(
            "/api/sweets/search?category=chocolate&min_price=1.00&max_price=10.00",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        
        for sweet in data:
            assert sweet["category"] == "chocolate"
            assert 1.00 <= sweet["price"] <= 10.00


@pytest.mark.sweets
class TestUpdateSweet:
    """Test update sweet endpoint"""
    
    def test_update_sweet_as_admin_success(self, client, auth_headers_admin, test_sweet):
        """
        TEST: Admin updates a sweet
        EXPECT: 200 OK with updated data
        """
        response = client.put(
            f"/api/sweets/{test_sweet.id}",
            json={
                "name": "Updated Chocolate Bar",
                "price": 3.49
            },
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["name"] == "Updated Chocolate Bar"
        assert data["price"] == 3.49
    
    def test_update_sweet_as_user_forbidden(self, client, auth_headers_user, test_sweet):
        """
        TEST: Regular user tries to update a sweet
        EXPECT: 403 Forbidden
        """
        response = client.put(
            f"/api/sweets/{test_sweet.id}",
            json={"price": 5.99},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_update_nonexistent_sweet(self, client, auth_headers_admin):
        """
        TEST: Update non-existent sweet
        EXPECT: 404 Not Found
        """
        response = client.put(
            "/api/sweets/99999",
            json={"price": 1.99},
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.sweets
class TestDeleteSweet:
    """Test delete sweet endpoint"""
    
    def test_delete_sweet_as_admin_success(self, client, auth_headers_admin, test_sweet):
        """
        TEST: Admin deletes a sweet
        EXPECT: 204 No Content
        """
        response = client.delete(
            f"/api/sweets/{test_sweet.id}",
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify sweet is soft-deleted (is_active = False)
        get_response = client.get(
            f"/api/sweets/{test_sweet.id}",
            headers=auth_headers_admin
        )
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_delete_sweet_as_user_forbidden(self, client, auth_headers_user, test_sweet):
        """
        TEST: Regular user tries to delete a sweet
        EXPECT: 403 Forbidden
        """
        response = client.delete(
            f"/api/sweets/{test_sweet.id}",
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN

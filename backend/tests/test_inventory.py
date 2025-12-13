"""
Tests for inventory management endpoints

Following TDD principles: Red-Green-Refactor
"""
import pytest
from fastapi import status


@pytest.mark.inventory
class TestPurchaseSweet:
    """Test purchase sweet endpoint"""
    
    def test_purchase_sweet_success(self, client, auth_headers_user, test_sweet, db_session):
        """
        TEST: Purchase sweet with sufficient stock
        EXPECT: 200 OK with updated quantity
        """
        initial_quantity = test_sweet.quantity
        purchase_quantity = 5
        
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": purchase_quantity},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["success"] is True
        assert data["sweet"]["quantity"] == initial_quantity - purchase_quantity
    
    def test_purchase_sweet_insufficient_stock(self, client, auth_headers_user, test_sweet):
        """
        TEST: Purchase more than available stock
        EXPECT: 400 Bad Request
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": 999999},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "insufficient stock" in response.json()["detail"].lower()
    
    def test_purchase_out_of_stock_sweet(self, client, auth_headers_user, db_session):
        """
        TEST: Purchase sweet that is out of stock
        EXPECT: 400 Bad Request
        """
        from app.models import Sweet
        
        out_of_stock = Sweet(
            name="Out of Stock Sweet",
            category="candy",
            price=2.99,
            quantity=0,
            is_active=True
        )
        db_session.add(out_of_stock)
        db_session.commit()
        db_session.refresh(out_of_stock)
        
        response = client.post(
            f"/api/sweets/{out_of_stock.id}/purchase",
            json={"quantity": 1},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "out of stock" in response.json()["detail"].lower()
    
    def test_purchase_invalid_quantity_zero(self, client, auth_headers_user, test_sweet):
        """
        TEST: Purchase with quantity of 0
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": 0},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_purchase_invalid_quantity_negative(self, client, auth_headers_user, test_sweet):
        """
        TEST: Purchase with negative quantity
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": -5},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_purchase_nonexistent_sweet(self, client, auth_headers_user):
        """
        TEST: Purchase non-existent sweet
        EXPECT: 404 Not Found
        """
        response = client.post(
            "/api/sweets/99999/purchase",
            json={"quantity": 1},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
    
    def test_purchase_unauthorized(self, client, test_sweet):
        """
        TEST: Purchase without authentication
        EXPECT: 401 Unauthorized
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": 1}
        )
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.inventory
class TestRestockSweet:
    """Test restock sweet endpoint"""
    
    def test_restock_sweet_as_admin_success(self, client, auth_headers_admin, test_sweet, db_session):
        """
        TEST: Admin restocks a sweet
        EXPECT: 200 OK with updated quantity
        """
        initial_quantity = test_sweet.quantity
        restock_quantity = 50
        
        response = client.post(
            f"/api/sweets/{test_sweet.id}/restock",
            json={"quantity": restock_quantity},
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["success"] is True
        assert data["sweet"]["quantity"] == initial_quantity + restock_quantity
    
    def test_restock_sweet_as_user_forbidden(self, client, auth_headers_user, test_sweet):
        """
        TEST: Regular user tries to restock
        EXPECT: 403 Forbidden
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/restock",
            json={"quantity": 10},
            headers=auth_headers_user
        )
        
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_restock_reactivates_inactive_sweet(self, client, auth_headers_admin, test_sweet, db_session):
        """
        TEST: Restocking reactivates an inactive sweet
        EXPECT: 200 OK with is_active = True
        """
        test_sweet.is_active = False
        db_session.commit()
        
        response = client.post(
            f"/api/sweets/{test_sweet.id}/restock",
            json={"quantity": 20},
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["sweet"]["is_active"] is True
    
    def test_restock_invalid_quantity(self, client, auth_headers_admin, test_sweet):
        """
        TEST: Restock with invalid quantity
        EXPECT: 422 Unprocessable Entity
        """
        response = client.post(
            f"/api/sweets/{test_sweet.id}/restock",
            json={"quantity": 0},
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_restock_nonexistent_sweet(self, client, auth_headers_admin):
        """
        TEST: Restock non-existent sweet
        EXPECT: 404 Not Found
        """
        response = client.post(
            "/api/sweets/99999/restock",
            json={"quantity": 10},
            headers=auth_headers_admin
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.inventory
class TestInventoryIntegration:
    """Integration tests for inventory operations"""
    
    def test_complete_inventory_flow(
        self,
        client,
        auth_headers_user,
        auth_headers_admin,
        test_sweet,
        db_session
    ):
        """
        TEST: Complete inventory workflow
        - Purchase reduces stock
        - Restock increases stock
        - Out of stock prevents purchase
        """
        # Initial state
        initial_qty = test_sweet.quantity
        
        # Step 1: Purchase some sweets
        purchase_qty = 10
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": purchase_qty},
            headers=auth_headers_user
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["sweet"]["quantity"] == initial_qty - purchase_qty
        
        # Step 2: Purchase remaining stock
        remaining_qty = initial_qty - purchase_qty
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": remaining_qty},
            headers=auth_headers_user
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["sweet"]["quantity"] == 0
        
        # Step 3: Try to purchase when out of stock
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": 1},
            headers=auth_headers_user
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
        # Step 4: Admin restocks
        restock_qty = 100
        response = client.post(
            f"/api/sweets/{test_sweet.id}/restock",
            json={"quantity": restock_qty},
            headers=auth_headers_admin
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["sweet"]["quantity"] == restock_qty
        
        # Step 5: Can purchase again
        response = client.post(
            f"/api/sweets/{test_sweet.id}/purchase",
            json={"quantity": 5},
            headers=auth_headers_user
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.json()["sweet"]["quantity"] == restock_qty - 5

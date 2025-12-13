import React from 'react';
import { sweets } from '../services/api';

function SweetCard({ sweet, onUpdate, isAdmin }) {
  const [purchasing, setPurchasing] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.quantity) return;

    setPurchasing(true);
    try {
      await sweets.purchase(sweet.id, quantity);
      alert(`Successfully purchased ${quantity} ${sweet.name}!`);
      setQuantity(1);
      if (onUpdate) onUpdate();
    } catch (error) {
      alert(error.response?.data?.detail || 'Purchase failed');
    } finally {
      setPurchasing(false);
    }
  };

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="sweet-card">
      <img
        src={sweet.image_url || 'https://via.placeholder.com/200x200/667eea/ffffff?text=Sweet'}
        alt={sweet.name}
        className="sweet-image"
      />
      <div className="sweet-content">
        <div className="sweet-header">
          <h3 className="sweet-name">{sweet.name}</h3>
          <span className="sweet-price">${sweet.price.toFixed(2)}</span>
        </div>
        
        <span className="sweet-category">{sweet.category}</span>
        
        {sweet.description && (
          <p className="sweet-description">{sweet.description}</p>
        )}
        
        <div className="sweet-quantity">
          <span>Stock:</span>
          <span className={`quantity-badge ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
            {isOutOfStock ? 'Out of Stock' : `${sweet.quantity} available`}
          </span>
        </div>

        {!isAdmin && (
          <div className="sweet-actions">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="form-control"
              style={{ width: '80px' }}
              disabled={isOutOfStock}
            />
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
              className="btn btn-primary"
            >
              {purchasing ? 'Processing...' : 'Purchase'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetCard;

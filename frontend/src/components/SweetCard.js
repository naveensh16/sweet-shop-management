import React from 'react';
import { sweets } from '../services/api';

function SweetCard({ sweet, onUpdate, isAdmin, viewMode = 'grid' }) {
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
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 10;

  const getCategoryEmoji = (category) => {
    const emojis = {
      chocolate: '🍫',
      gummy: '🍬',
      candy: '🍭',
      lollipop: '🍭',
      mint: '🌿'
    };
    return emojis[category?.toLowerCase()] || '🍬';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border-2 border-pink-100">
        <div className="flex gap-6">
          <div className="relative">
            <img
              src={sweet.image_url || 'https://via.placeholder.com/150x150/667eea/ffffff?text=Sweet'}
              alt={sweet.name}
              className="w-32 h-32 rounded-lg object-cover shadow-md"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OUT OF STOCK</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {getCategoryEmoji(sweet.category)} {sweet.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-xs font-semibold">
                    {sweet.category?.charAt(0).toUpperCase() + sweet.category?.slice(1)}
                  </span>
                </div>
                <span className="text-3xl font-extrabold text-purple-600">
                  ${sweet.price.toFixed(2)}
                </span>
              </div>
              
              {sweet.description && (
                <p className="text-gray-600 mb-3">{sweet.description}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">Stock:</span>
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                    ❌ Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold animate-pulse">
                    ⚠️ Only {sweet.quantity} left!
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                    ✅ {sweet.quantity} available
                  </span>
                )}
              </div>

              {!isAdmin && (
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max={sweet.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    disabled={isOutOfStock}
                  />
                  <button
                    onClick={handlePurchase}
                    disabled={isOutOfStock || purchasing}
                    className={`px-6 py-2 rounded-lg font-bold transition-all duration-200 ${
                      isOutOfStock || purchasing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105'
                    }`}
                  >
                    {purchasing ? '⌛ Processing...' : '🛒 Purchase'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-100 transform hover:scale-105">
      <div className="relative">
        <img
          src={sweet.image_url || 'https://via.placeholder.com/300x300/667eea/ffffff?text=Sweet'}
          alt={sweet.name}
          className="w-full h-56 object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">OUT OF STOCK</span>
          </div>
        )}
        <span className="absolute top-3 right-3 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold shadow-lg">
          ${sweet.price.toFixed(2)}
        </span>
      </div>
      
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {getCategoryEmoji(sweet.category)} {sweet.name}
          </h3>
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-xs font-semibold">
            {sweet.category?.charAt(0).toUpperCase() + sweet.category?.slice(1)}
          </span>
        </div>
        
        {sweet.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{sweet.description}</p>
        )}
        
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold w-full text-center">
              ❌ Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold w-full text-center animate-pulse">
              ⚠️ Only {sweet.quantity} left!
            </span>
          ) : (
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold w-full text-center">
              ✅ {sweet.quantity} available
            </span>
          )}
        </div>

        {!isAdmin && (
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              max={sweet.quantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              disabled={isOutOfStock}
            />
            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || purchasing}
              className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                isOutOfStock || purchasing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105'
              }`}
            >
              {purchasing ? '⌛ Processing...' : '🛒 Add to Cart'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SweetCard;

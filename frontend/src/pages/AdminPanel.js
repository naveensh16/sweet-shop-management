import React, { useState, useEffect } from 'react';
import { sweets as sweetsAPI } from '../services/api';

function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: '',
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const loadSweets = async () => {
    setLoading(true);
    try {
      const response = await sweetsAPI.getAll({ in_stock_only: false });
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to load sweets:', error);
      showNotification('Failed to load sweets', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingSweet(null);
    setFormData({
      name: '',
      category: 'chocolate',
      price: '',
      quantity: '',
      description: '',
      image_url: '',
    });
    setShowModal(true);
  };

  const openEditModal = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || '',
      image_url: sweet.image_url || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (editingSweet) {
        await sweetsAPI.update(editingSweet.id, data);
        showNotification('✅ Sweet updated successfully!', 'success');
      } else {
        await sweetsAPI.create(data);
        showNotification('✅ Sweet created successfully!', 'success');
      }

      setShowModal(false);
      loadSweets();
    } catch (error) {
      showNotification(error.response?.data?.detail || '❌ Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsAPI.delete(id);
      showNotification('✅ Sweet deleted successfully!', 'success');
      loadSweets();
    } catch (error) {
      showNotification(error.response?.data?.detail || '❌ Delete failed', 'error');
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter quantity to restock:');
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;

    try {
      await sweetsAPI.restock(id, parseInt(quantity));
      showNotification(`✅ Restocked ${quantity} items successfully!`, 'success');
      loadSweets();
    } catch (error) {
      showNotification(error.response?.data?.detail || '❌ Restock failed', 'error');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-2xl border-2 ${
            notification.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <p className="font-semibold">{notification.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-indigo-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-extrabold mb-2">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  👨‍💼 Admin Panel
                </span>
              </h1>
              <p className="text-gray-600 text-lg">Manage your sweet inventory</p>
            </div>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
            >
              ➕ Add New Sweet
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-blue-700">{sweets.length}</div>
              <div className="text-sm text-blue-600 font-medium">Total Products</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-700">{sweets.filter(s => s.quantity > 0).length}</div>
              <div className="text-sm text-green-600 font-medium">In Stock</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border-2 border-red-200">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-2xl font-bold text-red-700">{sweets.filter(s => s.quantity === 0).length}</div>
              <div className="text-sm text-red-600 font-medium">Out of Stock</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-200">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-yellow-700">{sweets.filter(s => s.quantity > 0 && s.quantity <= 10).length}</div>
              <div className="text-sm text-yellow-600 font-medium">Low Stock</div>
            </div>
          </div>
        </div>
        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-100">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-800">📊 Inventory Management</h3>
            <p className="text-gray-600 mt-1">Total: {sweets.length} items</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="border-b-2 border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Quantity</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sweets.map((sweet) => (
                  <tr key={sweet.id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={sweet.image_url || 'https://via.placeholder.com/50x50/667eea/ffffff?text=S'}
                          alt={sweet.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-md"
                        />
                        <span className="font-semibold text-gray-800">{sweet.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-semibold">
                        {getCategoryEmoji(sweet.category)}
                        <span className="capitalize">{sweet.category}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-purple-600 text-lg">
                      ${sweet.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold text-lg ${
                        sweet.quantity === 0 ? 'text-red-600' :
                        sweet.quantity <= 10 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {sweet.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {sweet.quantity === 0 ? (
                        <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                          ❌ Out of Stock
                        </span>
                      ) : sweet.quantity <= 10 ? (
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                          ✅ In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openEditModal(sweet)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleRestock(sweet.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                          title="Restock"
                        >
                          📦
                        </button>
                        <button
                          onClick={() => handleDelete(sweet.id)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border-2 border-indigo-100"
            onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 border-b-2 border-indigo-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {editingSweet ? '✏️ Edit Sweet' : '➕ Add New Sweet'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    placeholder="Enter sweet name..."
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="chocolate">🍫 Chocolate</option>
                    <option value="gummy">🍬 Gummy</option>
                    <option value="candy">🍭 Candy</option>
                    <option value="lollipop">🍭 Lollipop</option>
                    <option value="mint">🌿 Mint</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Quantity */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    placeholder="0"
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all resize-none"
                    placeholder="Enter product description..."
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                  {formData.image_url && (
                    <div className="mt-3">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="w-32 h-32 rounded-lg object-cover shadow-md border-2 border-gray-200"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/128x128/667eea/ffffff?text=Error'}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  {editingSweet ? '💾 Update Sweet' : '➕ Create Sweet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

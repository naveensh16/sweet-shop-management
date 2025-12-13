import React, { useState, useEffect } from 'react';
import { sweets as sweetsAPI } from '../services/api';

function AdminPanel() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: '',
  });

  const loadSweets = async () => {
    setLoading(true);
    try {
      const response = await sweetsAPI.getAll({ in_stock_only: false });
      setSweets(response.data);
    } catch (error) {
      console.error('Failed to load sweets:', error);
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
        alert('Sweet updated successfully!');
      } else {
        await sweetsAPI.create(data);
        alert('Sweet created successfully!');
      }

      setShowModal(false);
      loadSweets();
    } catch (error) {
      alert(error.response?.data?.detail || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await sweetsAPI.delete(id);
      alert('Sweet deleted successfully!');
      loadSweets();
    } catch (error) {
      alert(error.response?.data?.detail || 'Delete failed');
    }
  };

  const handleRestock = async (id) => {
    const quantity = prompt('Enter quantity to restock:');
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;

    try {
      await sweetsAPI.restock(id, parseInt(quantity));
      alert('Sweet restocked successfully!');
      loadSweets();
    } catch (error) {
      alert(error.response?.data?.detail || 'Restock failed');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '36px' }}>
          👨‍💼 Admin Panel
        </h1>
        <button onClick={openAddModal} className="btn btn-success">
          ➕ Add New Sweet
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>Manage Sweets ({sweets.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Quantity</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sweets.map((sweet) => (
                  <tr key={sweet.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '12px' }}>{sweet.name}</td>
                    <td style={{ padding: '12px', textTransform: 'capitalize' }}>{sweet.category}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${sweet.price.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{sweet.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span className={`badge ${sweet.quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {sweet.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEditModal(sweet)}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '14px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRestock(sweet.id)}
                          className="btn btn-success"
                          style={{ padding: '6px 12px', fontSize: '14px' }}
                        >
                          Restock
                        </button>
                        <button
                          onClick={() => handleDelete(sweet.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '14px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="chocolate">Chocolate</option>
                  <option value="gummy">Gummy</option>
                  <option value="candy">Candy</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  className="form-control"
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSweet ? 'Update' : 'Create'}
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

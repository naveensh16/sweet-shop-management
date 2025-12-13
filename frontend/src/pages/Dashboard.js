import React, { useState, useEffect } from 'react';
import { sweets as sweetsAPI } from '../services/api';
import SweetCard from '../components/SweetCard';

function Dashboard() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(true);

  const loadSweets = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm || category || minPrice || maxPrice) {
        params.name = searchTerm;
        params.category = category;
        params.min_price = minPrice;
        params.max_price = maxPrice;
        params.in_stock_only = inStockOnly;
        const response = await sweetsAPI.search(params);
        setSweets(response.data);
      } else {
        const response = await sweetsAPI.getAll({ in_stock_only: inStockOnly });
        setSweets(response.data);
      }
    } catch (error) {
      console.error('Failed to load sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, [inStockOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    loadSweets();
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(true);
    loadSweets();
  };

  const categories = ['chocolate', 'gummy', 'candy'];

  return (
    <div className="container">
      <h1 style={{ color: 'white', marginBottom: '24px', textAlign: 'center', fontSize: '36px' }}>
        🍬 Sweet Shop Dashboard
      </h1>

      <div className="search-bar">
        <h3 style={{ marginBottom: '16px' }}>Search & Filter Sweets</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="filter-group">
            <div className="form-group">
              <label>Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Min Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Min $"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Max Price</label>
              <input
                type="number"
                className="form-control"
                placeholder="Max $"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                In Stock Only
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading sweets...</div>
      ) : sweets.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No sweets found</h3>
          <p>Try adjusting your search filters</p>
        </div>
      ) : (
        <>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>
            Available Sweets ({sweets.length})
          </h2>
          <div className="grid">
            {sweets.map((sweet) => (
              <SweetCard key={sweet.id} sweet={sweet} onUpdate={loadSweets} isAdmin={false} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;

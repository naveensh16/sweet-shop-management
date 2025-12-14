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
  const [viewMode, setViewMode] = useState('grid');

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

  const categories = ['chocolate', 'gummy', 'candy', 'lollipop', 'mint'];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Loading delicious sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-transparent bg-clip-text">
              🍬 Sweet Shop 🍭
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-6">Discover our delicious selection of premium sweets!</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="px-6 py-2 bg-white rounded-full shadow-md text-sm font-bold text-gray-800 border-2 border-pink-200">
              ✨ {sweets.length} Varieties
            </span>
            <span className="px-6 py-2 bg-white rounded-full shadow-md text-sm font-bold text-gray-800 border-2 border-purple-200">
              🎯 {sweets.filter(s => s.quantity > 0).length} In Stock
            </span>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🔍 Search & Filter
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Grid View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="List View"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="🔎 Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all text-lg"
              />
              <svg className="absolute left-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  step="0.01"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Price</label>
                <input
                  type="number"
                  placeholder="$100"
                  step="0.01"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Status</label>
                <label className="flex items-center h-full">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-5 h-5 text-pink-500 border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-700 font-medium">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                🔍 Search
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                ↺ Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {sweets.length === 0 ? '😔 No sweets found' : `🍭 ${sweets.length} Sweet${sweets.length !== 1 ? 's' : ''} Available`}
          </h2>
        </div>

        {/* Sweets Grid/List */}
        {sweets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No sweets match your search</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onUpdate={loadSweets}
                viewMode={viewMode}
                isAdmin={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

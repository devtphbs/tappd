import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, X, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { getReceipts, deleteReceipt, exportToCSV } from '../db.js';

export default function LogTab() {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedReceipt, setExpandedReceipt] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'travel', label: 'Travel' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'transport', label: 'Transportation' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    // TODO: Load receipts from IndexedDB
    loadReceipts();
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [receipts, searchTerm, selectedCategory, dateRange]);

  const loadReceipts = async () => {
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Error loading receipts:', error);
      // Fallback to mock data
      const mockReceipts = [
        {
          id: 1,
          merchant: 'Starbucks',
          date: '2024-03-23',
          category: 'food',
          total: 9.72,
          currency: 'USD',
          items: [
            { name: 'Caramel Macchiato', price: 5.75 },
            { name: 'Blueberry Muffin', price: 3.25 }
          ],
          subtotal: 9.00,
          tax: 0.72
        },
        {
          id: 2,
          merchant: 'Whole Foods',
          date: '2024-03-22',
          category: 'food',
          total: 45.67,
          currency: 'USD',
          items: [
            { name: 'Organic Milk', price: 4.99 },
            { name: 'Avocados', price: 6.99 },
            { name: 'Quinoa', price: 8.99 },
            { name: 'Greek Yogurt', price: 5.99 },
            { name: 'Salmon', price: 18.71 }
          ],
          subtotal: 45.67,
          tax: 0.00
        },
        {
          id: 3,
          merchant: 'Uber',
          date: '2024-03-21',
          category: 'transport',
          total: 12.50,
          currency: 'USD',
          items: [
            { name: 'Ride to Downtown', price: 12.50 }
          ],
          subtotal: 11.36,
          tax: 1.14
        }
      ];
      setReceipts(mockReceipts);
    }
  };

  const filterReceipts = () => {
    let filtered = receipts;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(receipt => receipt.category === selectedCategory);
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(receipt => receipt.date >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(receipt => receipt.date <= dateRange.end);
    }

    setFilteredReceipts(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReceipt(id);
      setReceipts(receipts.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  const handleExport = async () => {
    try {
      const csv = await exportToCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tappd-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setDateRange({ start: '', end: '' });
    setShowFilters(false);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'bg-green-100 text-green-800',
      shopping: 'bg-purple-100 text-purple-800',
      travel: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-pink-100 text-pink-800',
      health: 'bg-red-100 text-red-800',
      transport: 'bg-yellow-100 text-yellow-800',
      bills: 'bg-gray-100 text-gray-800',
      other: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="p-6 pb-safe-bottom">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${
              (selectedCategory !== 'all' || dateRange.start || dateRange.end) ? 'bg-primary-100 text-primary-700' : ''
            }`}
          >
            <Filter size={16} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            onClick={handleExport}
            className="btn-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>

          {(selectedCategory !== 'all' || dateRange.start || dateRange.end || searchTerm) && (
            <button onClick={clearFilters} className="btn-secondary">
              <X size={16} />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Receipts List */}
      <div className="space-y-3">
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              {receipts.length === 0 ? 'No receipts yet' : 'No receipts match your filters'}
            </div>
            <p className="text-sm text-gray-500">
              {receipts.length === 0 
                ? 'Start by scanning your first receipt' 
                : 'Try adjusting your filters or search term'
              }
            </p>
          </div>
        ) : (
          filteredReceipts.map(receipt => (
            <div key={receipt.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{receipt.merchant}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{formatDate(receipt.date)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(receipt.category)}`}>
                      {categories.find(c => c.value === receipt.category)?.label || receipt.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-lg">{formatCurrency(receipt.total, receipt.currency)}</div>
                  <button
                    onClick={() => handleDelete(receipt.id)}
                    className="text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setExpandedReceipt(expandedReceipt === receipt.id ? null : receipt.id)}
                className="text-primary-600 text-sm font-medium"
              >
                {expandedReceipt === receipt.id ? 'Hide' : 'Show'} details
              </button>

              {expandedReceipt === receipt.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="space-y-2">
                    {receipt.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name}</span>
                        <span>{formatCurrency(item.price, receipt.currency)}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>{formatCurrency(receipt.subtotal, receipt.currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span>{formatCurrency(receipt.tax, receipt.currency)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(receipt.total, receipt.currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredReceipts.length > 0 && (
        <div className="mt-6 p-4 bg-primary-50 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-primary-600 mb-1">Total spent</div>
            <div className="text-2xl font-bold text-primary-700">
              {formatCurrency(
                filteredReceipts.reduce((sum, r) => sum + r.total, 0),
                filteredReceipts[0]?.currency || 'USD'
              )}
            </div>
            <div className="text-xs text-primary-600 mt-1">
              {filteredReceipts.length} receipt{filteredReceipts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

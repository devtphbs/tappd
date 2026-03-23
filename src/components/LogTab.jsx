import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Trash2, Calendar, DollarSign } from 'lucide-react';
import { getUserReceipts, deleteReceipt } from '../supabase.js';
import { getUserSettings } from '../supabase.js';
import { haptics } from '../utils/haptics.js';

export default function LogTab({ user }) {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceipts();
    loadUserSettings();
  }, []);

  useEffect(() => {
    filterReceipts();
  }, [receipts, searchTerm, selectedCategory]);

  const loadReceipts = async () => {
    try {
      const { data } = await getUserReceipts(user.id);
      setReceipts(data || []);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserSettings = async () => {
    try {
      const { data: settings } = await getUserSettings(user.id);
      if (settings?.home_currency) {
        setHomeCurrency(settings.home_currency);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const filterReceipts = () => {
    let filtered = receipts;

    if (searchTerm) {
      filtered = filtered.filter(receipt =>
        receipt.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(receipt => receipt.category === selectedCategory);
    }

    setFilteredReceipts(filtered);
  };

  const handleDelete = async (receiptId) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        haptics.delete();
        await deleteReceipt(receiptId);
        await loadReceipts();
      } catch (error) {
        console.error('Error deleting receipt:', error);
        alert('Error deleting receipt. Please try again.');
      }
    }
  };

  const exportToCSV = () => {
    haptics.save();
    
    const csvContent = [
      ['Date', 'Merchant', 'Category', 'Amount', 'Currency'],
      ...filteredReceipts.map(receipt => [
        receipt.date,
        receipt.merchant,
        receipt.category,
        receipt.total.toString(),
        receipt.currency || 'USD'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const categories = ['All', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Other'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="glass-card mb-6">
        <h2 className="text-2xl font-bold mb-2">Receipt Log</h2>
        <p className="text-white/80">View and manage all your scanned receipts</p>
      </div>

      <div className="glass-card mb-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input pl-12"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="glass-input pl-12 appearance-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <button
              onClick={exportToCSV}
              className="glass-button flex items-center gap-2 px-4"
              disabled={filteredReceipts.length === 0}
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="glass-card text-center py-12">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt size={40} className="text-white/60" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No receipts found</h3>
          <p className="text-white/60">
            {receipts.length === 0 
              ? "Start scanning receipts to see them here"
              : "Try adjusting your search or filter"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{receipt.merchant}</h3>
                    <span className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                      {receipt.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/60 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      {receipt.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={16} />
                      {formatCurrency(receipt.total, receipt.currency)}
                    </div>
                  </div>

                  {receipt.items && receipt.items.length > 0 && (
                    <div className="text-white/60 text-sm">
                      <span className="font-medium">{receipt.items.length} items</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(receipt.id)}
                  className="glass-button p-2 text-red-300 hover:text-red-200"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {receipt.image_url && (
                <div className="mt-4">
                  <img
                    src={receipt.image_url}
                    alt={receipt.merchant}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-white/60 text-sm">
        Showing {filteredReceipts.length} of {receipts.length} receipts
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, ShoppingCart, Coffee, Car, Gamepad2, Zap, Heart } from 'lucide-react';
import { getUserReceipts } from '../supabase.js';
import { getUserSettings } from '../supabase.js';
import { haptics } from '../utils/haptics.js';

export default function OverviewTab({ user }) {
  const [receipts, setReceipts] = useState([]);
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const loadData = async () => {
    try {
      const [receiptsData, settingsData] = await Promise.all([
        getUserReceipts(user.id),
        getUserSettings(user.id)
      ]);
      
      setReceipts(receiptsData.data || []);
      if (settingsData.data?.home_currency) {
        setHomeCurrency(settingsData.data.home_currency);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getMonthReceipts = () => {
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate.getMonth() === selectedMonth && receiptDate.getFullYear() === selectedYear;
    });
  };

  const getCategoryTotals = () => {
    const monthReceipts = getMonthReceipts();
    const totals = {};
    
    monthReceipts.forEach(receipt => {
      const category = receipt.category || 'Other';
      totals[category] = (totals[category] || 0) + receipt.total;
    });
    
    return totals;
  };

  const getDailySpending = () => {
    const monthReceipts = getMonthReceipts();
    const daily = {};
    
    monthReceipts.forEach(receipt => {
      const day = new Date(receipt.date).getDate();
      daily[day] = (daily[day] || 0) + receipt.total;
    });
    
    // Fill missing days with 0
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const result = [];
    for (let i = 1; i <= daysInMonth; i++) {
      result.push(daily[i] || 0);
    }
    
    return result;
  };

  const getTotalSpending = () => {
    const monthReceipts = getMonthReceipts();
    return monthReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
  };

  const getAverageSpending = () => {
    const monthReceipts = getMonthReceipts();
    if (monthReceipts.length === 0) return 0;
    return getTotalSpending() / monthReceipts.length;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': Coffee,
      'Transportation': Car,
      'Shopping': ShoppingCart,
      'Entertainment': Gamepad2,
      'Bills & Utilities': Zap,
      'Healthcare': Heart,
    };
    return icons[category] || DollarSign;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food & Dining': 'from-orange-500 to-red-500',
      'Transportation': 'from-blue-500 to-cyan-500',
      'Shopping': 'from-purple-500 to-pink-500',
      'Entertainment': 'from-pink-500 to-rose-500',
      'Bills & Utilities': 'from-yellow-500 to-orange-500',
      'Healthcare': 'from-green-500 to-emerald-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading overview...</p>
        </div>
      </div>
    );
  }

  const monthReceipts = getMonthReceipts();
  const categoryTotals = getCategoryTotals();
  const dailySpending = getDailySpending();
  const totalSpending = getTotalSpending();
  const averageSpending = getAverageSpending();

  return (
    <div className="p-6">
      <div className="glass-card mb-6">
        <h2 className="text-2xl font-bold mb-2">Spending Overview</h2>
        <p className="text-white/80">Track your expenses and spending patterns</p>
      </div>

      <div className="glass-card mb-6">
        <div className="flex gap-4 mb-6">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="glass-input flex-1"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="glass-input w-32"
          >
            {[2024, 2023, 2022].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Total Spending</span>
              <TrendingUp size={16} className="text-green-400" />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpending, homeCurrency)}
            </div>
            <div className="text-white/60 text-xs mt-1">
              {monthReceipts.length} receipts
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Average</span>
              <DollarSign size={16} className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(averageSpending, homeCurrency)}
            </div>
            <div className="text-white/60 text-xs mt-1">
              Per receipt
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Daily Average</span>
              <Calendar size={16} className="text-purple-400" />
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpending / 30, homeCurrency)}
            </div>
            <div className="text-white/60 text-xs mt-1">
              Per day
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card mb-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        
        {Object.keys(categoryTotals).length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingCart size={32} className="text-white/60" />
            </div>
            <p className="text-white/60">No spending data for this month</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(categoryTotals)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => {
                const Icon = getCategoryIcon(category);
                const percentage = totalSpending > 0 ? (amount / totalSpending) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(category)} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{category}</span>
                        <span className="text-white/80">{formatCurrency(amount, homeCurrency)}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getCategoryColor(category)} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-semibold mb-4">Daily Spending</h3>
        
        <div className="h-32 flex items-end gap-1">
          {dailySpending.map((amount, index) => {
            const maxAmount = Math.max(...dailySpending);
            const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
            const hasData = amount > 0;
            
            return (
              <div
                key={index}
                className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t transition-all duration-300 hover:opacity-80"
                style={{ height: `${height}%`, minHeight: hasData ? '4px' : '2px' }}
                title={`Day ${index + 1}: ${formatCurrency(amount, homeCurrency)}`}
              />
            );
          })}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>1</span>
          <span>{dailySpending.length}</span>
        </div>
      </div>
    </div>
  );
}

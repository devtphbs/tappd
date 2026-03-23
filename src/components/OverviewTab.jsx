import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '../currency.js';

export default function OverviewTab() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [receipts, setReceipts] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);

  const categories = [
    { key: 'food', label: 'Food & Dining', icon: '🍔', color: 'bg-green-500' },
    { key: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
    { key: 'travel', label: 'Travel', icon: '✈️', color: 'bg-blue-500' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎮', color: 'bg-pink-500' },
    { key: 'health', label: 'Health & Fitness', icon: '💪', color: 'bg-red-500' },
    { key: 'transport', label: 'Transportation', icon: '🚗', color: 'bg-yellow-500' },
    { key: 'bills', label: 'Bills & Utilities', icon: '📱', color: 'bg-gray-500' },
    { key: 'other', label: 'Other', icon: '📦', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    loadData();
  }, [currentMonth, currentYear]);

  const loadData = async () => {
    // TODO: Load actual data from IndexedDB
    const mockReceipts = [
      {
        id: 1,
        merchant: 'Starbucks',
        date: '2024-03-23',
        category: 'food',
        total: 9.72,
        currency: 'USD'
      },
      {
        id: 2,
        merchant: 'Whole Foods',
        date: '2024-03-22',
        category: 'food',
        total: 45.67,
        currency: 'USD'
      },
      {
        id: 3,
        merchant: 'Uber',
        date: '2024-03-21',
        category: 'transport',
        total: 12.50,
        currency: 'USD'
      },
      {
        id: 4,
        merchant: 'Netflix',
        date: '2024-03-20',
        category: 'entertainment',
        total: 15.99,
        currency: 'USD'
      },
      {
        id: 5,
        merchant: 'Gym Membership',
        date: '2024-03-15',
        category: 'health',
        total: 50.00,
        currency: 'USD'
      }
    ];
    setReceipts(mockReceipts);

    const mockBudgets = {
      food: 500,
      shopping: 300,
      travel: 200,
      entertainment: 100,
      health: 100,
      transport: 150,
      bills: 500,
      other: 100
    };
    setBudgets(mockBudgets);
  };

  const getMonthReceipts = () => {
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate.getMonth() === currentMonth && receiptDate.getFullYear() === currentYear;
    });
  };

  const getLastMonthReceipts = () => {
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    return receipts.filter(receipt => {
      const receiptDate = new Date(receipt.date);
      return receiptDate.getMonth() === lastMonth && receiptDate.getFullYear() === lastYear;
    });
  };

  const getCategoryTotals = () => {
    const monthReceipts = getMonthReceipts();
    const totals = {};
    
    categories.forEach(cat => {
      totals[cat.key] = monthReceipts
        .filter(r => r.category === cat.key)
        .reduce((sum, r) => sum + r.total, 0);
    });
    
    return totals;
  };

  const getDailySpending = () => {
    const monthReceipts = getMonthReceipts();
    const daily = {};
    
    monthReceipts.forEach(receipt => {
      const day = receipt.date.split('-')[2];
      daily[day] = (daily[day] || 0) + receipt.total;
    });
    
    return daily;
  };

  const currentMonthTotal = getMonthReceipts().reduce((sum, r) => sum + r.total, 0);
  const lastMonthTotal = getLastMonthReceipts().reduce((sum, r) => sum + r.total, 0);
  const monthOverMonth = currentMonthTotal - lastMonthTotal;
  const monthOverMonthPercent = lastMonthTotal > 0 ? ((monthOverMonth / lastMonthTotal) * 100).toFixed(1) : 0;

  const categoryTotals = getCategoryTotals();
  const dailySpending = getDailySpending();

  const getBudgetStatus = (spent, budget) => {
    if (!budget) return 'neutral';
    const percent = (spent / budget) * 100;
    if (percent >= 100) return 'over';
    if (percent >= 80) return 'warning';
    return 'good';
  };

  const getBudgetColor = (status) => {
    switch (status) {
      case 'over': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  return (
    <div className="p-6">
      {/* Month Selector */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => changeMonth('prev')} className="p-2">
          <TrendingDown size={20} />
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button onClick={() => changeMonth('next')} className="p-2">
          <TrendingUp size={20} />
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="card mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Total Spending</div>
          <div className="text-3xl font-bold mb-2">{formatCurrency(currentMonthTotal)}</div>
          <div className={`flex items-center justify-center gap-1 text-sm ${
            monthOverMonth > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {monthOverMonth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{monthOverMonth > 0 ? '+' : ''}{monthOverMonthPercent}% from last month</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Categories</h3>
          <button
            onClick={() => setShowBudgetSetup(!showBudgetSetup)}
            className="text-primary-600 text-sm font-medium"
          >
            {showBudgetSetup ? 'Done' : 'Set Budgets'}
          </button>
        </div>

        <div className="space-y-3">
          {categories.map(category => {
            const spent = categoryTotals[category.key] || 0;
            const budget = budgets[category.key];
            const status = getBudgetStatus(spent, budget);
            const percent = budget ? (spent / budget) * 100 : 0;

            return (
              <div key={category.key} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(spent)}</div>
                    {budget && (
                      <div className="text-xs text-gray-500">of {formatCurrency(budget)}</div>
                    )}
                  </div>
                </div>

                {budget && (
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          status === 'over' ? 'bg-red-500' :
                          status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {showBudgetSetup && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Target size={16} className="text-gray-400" />
                    <input
                      type="number"
                      placeholder="Budget"
                      value={budget || ''}
                      onChange={(e) => setBudgets({
                        ...budgets,
                        [category.key]: parseFloat(e.target.value) || 0
                      })}
                      className="input-field text-sm flex-1"
                    />
                  </div>
                )}

                {budget && !showBudgetSetup && (
                  <div className={`text-xs px-2 py-1 rounded-full border ${getBudgetColor(status)}`}>
                    {status === 'over' && <><AlertTriangle size={12} className="inline mr-1" /> Over budget</>}
                    {status === 'warning' && <><AlertTriangle size={12} className="inline mr-1" /> {Math.round(percent)}% used</>}
                    {status === 'good' && <><Target size={12} className="inline mr-1" /> On track</>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Spending Sparkline */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Daily Spending</h3>
        <div className="flex items-end justify-between h-24 gap-1">
          {Array.from({ length: 31 }, (_, i) => {
            const day = (i + 1).toString().padStart(2, '0');
            const amount = dailySpending[day] || 0;
            const maxAmount = Math.max(...Object.values(dailySpending), 1);
            const height = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-500 rounded-t"
                  style={{ height: `${height}%`, minHeight: height > 0 ? '2px' : '0' }}
                />
                <span className="text-xs text-gray-500 mt-1">{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="card text-center">
          <DollarSign className="mx-auto mb-2 text-primary-600" size={20} />
          <div className="text-xs text-gray-600">Average/day</div>
          <div className="font-semibold">
            {formatCurrency(currentMonthTotal / Math.max(Object.keys(dailySpending).length, 1))}
          </div>
        </div>
        <div className="card text-center">
          <Calendar className="mx-auto mb-2 text-primary-600" size={20} />
          <div className="text-xs text-gray-600">Transactions</div>
          <div className="font-semibold">{getMonthReceipts().length}</div>
        </div>
      </div>
    </div>
  );
}

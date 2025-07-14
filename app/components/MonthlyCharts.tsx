'use client';

import { useState } from 'react';
import { Transaction } from '../types/budget';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/constants';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

interface MonthlyChartsProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export default function MonthlyCharts({ transactions, selectedMonth }: MonthlyChartsProps) {
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'line'>('pie');

  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  // Pie chart data for expenses
  const expensePieData = EXPENSE_CATEGORIES.map(category => {
    const total = monthTransactions
      .filter(t => t.type === 'expense' && t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.name,
      value: total,
      color: category.color.replace('bg-', '').replace('-500', ''),
    };
  }).filter(item => item.value > 0);

  // Bar chart data comparing categories
  const categoryBarData = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map(category => {
    const expenses = monthTransactions
      .filter(t => t.type === 'expense' && t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const income = monthTransactions
      .filter(t => t.type === 'income' && t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);

    if (expenses === 0 && income === 0) return null;

    return {
      category: category.name,
      expenses,
      income,
    };
  }).filter(Boolean);

  // Line chart data for balance over time
  const getMonthlyData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income,
        expenses,
        balance: income - expenses,
      });
    }
    
    return months;
  };

  const lineData = getMonthlyData();

  const COLORS = {
    'blue': '#3B82F6',
    'green': '#10B981',
    'orange': '#F59E0B',
    'red': '#EF4444',
    'gray': '#6B7280',
    'emerald': '#059669',
    'purple': '#8B5CF6',
    'pink': '#EC4899',
    'indigo': '#6366F1',
    'amber': '#F59E0B',
    'rose': '#F43F5E',
    'slate': '#64748B',
  };

  const getColor = (colorKey: string) => {
    const key = colorKey.split('-')[0] as keyof typeof COLORS;
    return COLORS[key] || '#6B7280';
  };

  const charts = [
    { id: 'pie', label: 'Expense Breakdown', icon: 'ri-pie-chart-line' },
    { id: 'bar', label: 'Category Comparison', icon: 'ri-bar-chart-line' },
    { id: 'line', label: 'Trends', icon: 'ri-line-chart-line' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Charts & Analytics</h2>
        
        <div className="flex rounded-lg bg-gray-50 p-1">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                activeChart === chart.id
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <i className={`${chart.icon} text-sm`}></i>
              <span>{chart.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        {activeChart === 'pie' && (
          <div>
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getColor(entry.color)} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <i className="ri-pie-chart-line text-4xl mb-4"></i>
                  <p>No expense data available for this month</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === 'bar' && (
          <div>
            {categoryBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBarData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="income" fill="#10B981" name="Income" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <i className="ri-bar-chart-line text-4xl mb-4"></i>
                  <p>No transaction data available for comparison</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeChart === 'line' && (
          <div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Income"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Balance"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useMemo } from 'react';
import { Transaction } from '../types/budget';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/constants';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

interface MonthlyChartsProps {
  transactions: Transaction[];
  selectedMonth: string;
}

type ChartView = 'pie' | 'bar' | 'line' | 'area';
type TimeRange = 'monthly' | 'quarterly' | 'yearly';
type ChartType = 'expense-breakdown' | 'category-comparison' | 'trends';

export default function MonthlyCharts({ transactions, selectedMonth }: MonthlyChartsProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('expense-breakdown');
  const [chartView, setChartView] = useState<ChartView>('pie');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Mock data for testing when no real data is available
  const mockExpenseData = [
    { name: 'Food & Dining', value: 450, color: 'orange' },
    { name: 'Transportation', value: 320, color: 'green' },
    { name: 'Housing', value: 1200, color: 'blue' },
    { name: 'Entertainment', value: 180, color: 'purple' },
    { name: 'Healthcare', value: 280, color: 'red' },
    { name: 'Personal Care', value: 120, color: 'pink' },
  ];

  const mockTrendData = [
    { date: 'Jan', income: 3500, expenses: 2800, balance: 700 },
    { date: 'Feb', income: 3800, expenses: 3100, balance: 700 },
    { date: 'Mar', income: 3600, expenses: 2900, balance: 700 },
    { date: 'Apr', income: 4000, expenses: 3200, balance: 800 },
    { date: 'May', income: 3700, expenses: 3000, balance: 700 },
    { date: 'Jun', income: 4200, expenses: 3400, balance: 800 },
  ];

  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  // Expense Breakdown Data
  const expenseBreakdownData = useMemo(() => {
    if (monthTransactions.length === 0) {
      return mockExpenseData;
    }

    return EXPENSE_CATEGORIES.map(category => {
      const total = monthTransactions
        .filter(t => t.type === 'expense' && t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: category.name,
        value: total,
        color: category.color.replace('bg-', '').replace('-500', ''),
      };
    }).filter(item => item.value > 0);
  }, [monthTransactions]);

  // Category Comparison Data
  const categoryComparisonData = useMemo(() => {
    const categories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
    return categories.map(category => {
      const expenses = monthTransactions
        .filter(t => t.type === 'expense' && t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      const income = monthTransactions
        .filter(t => t.type === 'income' && t.category === category.id)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: category.name,
        expenses,
        income,
        total: expenses + income,
      };
    }).filter(item => item.total > 0);
  }, [monthTransactions]);

  // Trends Data
  const trendsData = useMemo(() => {
    if (transactions.length === 0) {
      return mockTrendData;
    }

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
        date: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        income,
        expenses,
        balance: income - expenses,
      });
    }
    
    return months;
  }, [transactions]);

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

  const chartConfigs = [
    { 
      id: 'expense-breakdown', 
      label: '🕒 Expense Breakdown', 
      icon: 'ri-pie-chart-line',
      views: ['pie', 'bar'] as ChartView[]
    },
    { 
      id: 'category-comparison', 
      label: '📊 Category Comparison', 
      icon: 'ri-bar-chart-line',
      views: ['bar', 'pie'] as ChartView[]
    },
    { 
      id: 'trends', 
      label: '📈 Trends', 
      icon: 'ri-line-chart-line',
      views: ['line', 'bar', 'area'] as ChartView[]
    },
  ];

  const renderExpenseBreakdown = () => {
    if (expenseBreakdownData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <i className="ri-pie-chart-line text-4xl mb-4"></i>
            <p>No expense data available for this month</p>
          </div>
        </div>
      );
    }

    if (chartView === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseBreakdownData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {expenseBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.color)} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
              labelFormatter={(label) => `${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    if (chartView === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={expenseBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Bar dataKey="value" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderCategoryComparison = () => {
    if (categoryComparisonData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <i className="ri-bar-chart-line text-4xl mb-4"></i>
            <p>No transaction data available for comparison</p>
          </div>
        </div>
      );
    }

    if (chartView === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
      );
    }

    if (chartView === 'pie') {
      const pieData = categoryComparisonData.map(item => ({
        name: item.category,
        value: item.total,
        color: item.expenses > item.income ? 'red' : 'green',
      }));

      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.color)} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  const renderTrends = () => {
    if (chartView === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
      );
    }

    if (chartView === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="income" fill="#10B981" name="Income" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            <Bar dataKey="balance" fill="#3B82F6" name="Balance" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartView === 'area') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="income" 
              stackId="1"
              stroke="#10B981" 
              fill="#10B981" 
              fillOpacity={0.6}
              name="Income"
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stackId="1"
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.6}
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  const currentChartConfig = chartConfigs.find(config => config.id === activeChart);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 space-y-4 lg:space-y-0">
        <h2 className="text-xl font-semibold text-gray-800">Charts & Analytics</h2>
        
        {/* Main Chart Type Selector */}
        <div className="flex rounded-lg bg-gray-50 p-1">
          {chartConfigs.map((chart) => (
            <button
              key={chart.id}
              onClick={() => {
                setActiveChart(chart.id as ChartType);
                setChartView(chart.views[0]);
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                activeChart === chart.id
                  ? 'bg-purple-100 text-purple-700 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <span>{chart.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart View Toggle and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
        {/* Chart View Toggle */}
        {currentChartConfig && (
          <div className="flex rounded-lg bg-gray-50 p-1">
            {currentChartConfig.views.map((view) => (
              <button
                key={view}
                onClick={() => setChartView(view)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  chartView === view
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {view === 'pie' && 'Pie Chart'}
                {view === 'bar' && 'Bar Chart'}
                {view === 'line' && 'Line Chart'}
                {view === 'area' && 'Area Chart'}
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center space-x-3">
          {activeChart === 'category-comparison' && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-96">
        {activeChart === 'expense-breakdown' && renderExpenseBreakdown()}
        {activeChart === 'category-comparison' && renderCategoryComparison()}
        {activeChart === 'trends' && renderTrends()}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {activeChart === 'expense-breakdown' && (
          <>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total Expenses</div>
              <div className="text-2xl font-bold text-gray-800">
                ${expenseBreakdownData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Categories</div>
              <div className="text-2xl font-bold text-gray-800">{expenseBreakdownData.length}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Largest Category</div>
              <div className="text-lg font-semibold text-gray-800">
                {expenseBreakdownData.length > 0 ? expenseBreakdownData[0].name : 'N/A'}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
'use client';

import { Transaction, BudgetLimit } from '../types/budget';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../lib/constants';

interface CategorySummaryProps {
  transactions: Transaction[];
  selectedMonth: string;
  budgetLimits: BudgetLimit[];
}

export default function CategorySummary({ transactions, selectedMonth, budgetLimits }: CategorySummaryProps) {
  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = EXPENSE_CATEGORIES.map(category => {
    const categoryTransactions = monthTransactions.filter(
      t => t.type === 'expense' && t.category === category.id
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const budgetLimit = budgetLimits.find(b => b.categoryId === category.id);
    
    return {
      ...category,
      total,
      transactions: categoryTransactions,
      budgetLimit: budgetLimit?.limit || 0,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    };
  }).filter(cat => cat.total > 0 || cat.budgetLimit > 0);

  const incomeByCategory = INCOME_CATEGORIES.map(category => {
    const categoryTransactions = monthTransactions.filter(
      t => t.type === 'income' && t.category === category.id
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      ...category,
      total,
      transactions: categoryTransactions,
      percentage: totalIncome > 0 ? (total / totalIncome) * 100 : 0,
    };
  }).filter(cat => cat.total > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="ri-arrow-up-line text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i className="ri-arrow-down-line text-red-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className={`${balance >= 0 ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'} rounded-2xl p-6 border`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${balance >= 0 ? 'text-blue-600' : 'text-orange-600'} text-sm font-medium`}>Balance</p>
              <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                ${Math.abs(balance).toFixed(2)}
              </p>
            </div>
            <div className={`w-12 h-12 ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
              <i className={`${balance >= 0 ? 'ri-wallet-line text-blue-600' : 'ri-alert-line text-orange-600'} text-xl`}></i>
            </div>
          </div>
        </div>
      </div>

      {expensesByCategory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-pie-chart-line text-red-600 mr-2"></i>
            Expense Categories
          </h3>
          <div className="space-y-3">
            {expensesByCategory.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.transactions.length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${category.total.toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                    {category.budgetLimit > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.total > category.budgetLimit 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        ${category.budgetLimit} limit
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {incomeByCategory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="ri-line-chart-line text-green-600 mr-2"></i>
            Income Sources
          </h3>
          <div className="space-y-3">
            {incomeByCategory.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.transactions.length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">${category.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
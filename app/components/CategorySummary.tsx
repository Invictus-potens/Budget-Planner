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
        <div className="bg-success-light rounded-2xl p-6 border border-success-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success text-sm font-medium">Total de Receitas</p>
              <p className="text-2xl font-bold text-success-dark">${totalIncome.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-success-light rounded-full flex items-center justify-center">
              <i className="ri-arrow-up-line text-success text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-danger-light rounded-2xl p-6 border border-danger-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-danger text-sm font-medium">Total de Despesas</p>
              <p className="text-2xl font-bold text-danger-dark">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-danger-light rounded-full flex items-center justify-center">
              <i className="ri-arrow-down-line text-danger text-xl"></i>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`${balance >= 0 ? 'text-info' : 'text-warning'} text-sm font-medium`}>Saldo</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-info-dark' : 'text-warning-dark'}`}>${Math.abs(balance).toFixed(2)}</p>
          </div>
          <div className={`w-12 h-12 ${balance >= 0 ? 'bg-info-light' : 'bg-warning-light'} rounded-full flex items-center justify-center`}>
            <i className={`${balance >= 0 ? 'ri-wallet-line text-info' : 'ri-alert-line text-warning'} text-xl`}></i>
          </div>
        </div>
      </div>

      {expensesByCategory.length > 0 && (
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center">
            <i className="ri-pie-chart-line text-danger mr-2"></i>
            Categorias de Despesas
          </h3>
          <div className="space-y-3">
            {expensesByCategory.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-text">{category.name}</p>
                    <p className="text-sm text-muted">{category.transactions.length} transações</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text">${category.total.toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted">{category.percentage.toFixed(1)}%</p>
                    {category.budgetLimit > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.total > category.budgetLimit 
                          ? 'bg-danger-light text-danger' 
                          : 'bg-success-light text-success'
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
        <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center">
            <i className="ri-line-chart-line text-success mr-2"></i>
            Fontes de Receitas
          </h3>
          <div className="space-y-3">
            {incomeByCategory.map(category => (
              <div key={category.id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <p className="font-medium text-text">{category.name}</p>
                    <p className="text-sm text-muted">{category.transactions.length} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text">${category.total.toFixed(2)}</p>
                  <p className="text-sm text-muted">{category.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
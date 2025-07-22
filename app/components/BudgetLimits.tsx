'use client';

import { useState } from 'react';
import { BudgetLimit, Transaction } from '../types/budget';
import { EXPENSE_CATEGORIES } from '../lib/constants';

interface BudgetLimitsProps {
  budgetLimits: BudgetLimit[];
  onUpdate: (categoryId: string, limit: number) => void;
  transactions: Transaction[];
  selectedMonth: string;
}

export default function BudgetLimits({ budgetLimits, onUpdate, transactions, selectedMonth }: BudgetLimitsProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState('');

  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth) && t.type === 'expense'
  );

  const categoryData = EXPENSE_CATEGORIES.map(category => {
    const spent = monthTransactions
      .filter(t => t.category === category.id)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const budgetLimit = budgetLimits.find(b => b.categoryId === category.id);
    const limit = budgetLimit?.limit || 0;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;
    
    return {
      ...category,
      spent,
      limit,
      percentage,
      isOverBudget: limit > 0 && spent > limit,
      remaining: limit > 0 ? limit - spent : 0,
    };
  });

  const handleEdit = (categoryId: string, currentLimit: number) => {
    setEditingCategory(categoryId);
    setTempLimit(currentLimit.toString());
  };

  const handleSave = (categoryId: string) => {
    const limit = parseFloat(tempLimit) || 0;
    onUpdate(categoryId, limit);
    setEditingCategory(null);
    setTempLimit('');
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setTempLimit('');
  };

  const totalBudget = categoryData.reduce((sum, cat) => sum + cat.limit, 0);
  const totalSpent = categoryData.reduce((sum, cat) => sum + cat.spent, 0);
  const overBudgetCount = categoryData.filter(cat => cat.isOverBudget).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-info-light rounded-2xl p-6 border border-info-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-info text-sm font-medium">Total de Orçamento</p>
              <p className="text-2xl font-bold text-info-dark">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-info-light rounded-full flex items-center justify-center">
              <i className="ri-wallet-line text-info text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-primary-light rounded-2xl p-6 border border-primary-light">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-medium">Total Gasto</p>
              <p className="text-2xl font-bold text-primary-dark">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
              <i className="ri-shopping-cart-line text-primary text-xl"></i>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className={`${overBudgetCount > 0 ? 'text-danger' : 'text-success'} text-sm font-medium`}>
              Acima do Limite
            </p>
            <p className={`text-2xl font-bold ${overBudgetCount > 0 ? 'text-danger-dark' : 'text-success-dark'}`}>
              {overBudgetCount} {overBudgetCount === 1 ? 'Categoria' : 'Categorias'}
            </p>
          </div>
          <div className={`w-12 h-12 ${overBudgetCount > 0 ? 'bg-danger-light' : 'bg-success-light'} rounded-full flex items-center justify-center`}>
            <i className={`${overBudgetCount > 0 ? 'ri-alert-line text-danger' : 'ri-check-line text-success'} text-xl`}></i>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
        <h3 className="text-lg font-semibold text-text mb-6 flex items-center">
          <i className="ri-settings-line text-primary mr-2"></i>
          Limites de Orçamento por Categoria
        </h3>

        <div className="space-y-4">
          {categoryData.map(category => (
            <div key={category.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{category.name}</h4>
                    <p className="text-sm text-muted">
                      Gasto: ${category.spent.toFixed(2)}
                      {category.limit > 0 && (
                        <span className="ml-2">
                          / ${category.limit.toFixed(2)} ({category.percentage.toFixed(1)}%)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {category.isOverBudget && (
                    <span className="px-2 py-1 bg-danger-light text-danger text-xs rounded-full">
                      Acima do Limite em ${(category.spent - category.limit).toFixed(2)}
                    </span>
                  )}
                  
                  {editingCategory === category.id ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted text-sm">$</span>
                        <input
                          type="number"
                          value={tempLimit}
                          onChange={(e) => setTempLimit(e.target.value)}
                          className="w-24 pl-6 pr-2 py-1 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        onClick={() => handleSave(category.id)}
                        className="w-6 h-6 flex items-center justify-center text-success hover:bg-success-light rounded"
                      >
                        <i className="ri-check-line text-sm"></i>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-6 h-6 flex items-center justify-center text-muted hover:bg-surface rounded"
                      >
                        <i className="ri-close-line text-sm"></i>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(category.id, category.limit)}
                      className="px-3 py-1 text-sm text-primary hover:bg-primary-light rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <i className="ri-edit-line text-xs"></i>
                      <span>{category.limit > 0 ? 'Editar' : 'Definir'} Limite</span>
                    </button>
                  )}
                </div>
              </div>

              {category.limit > 0 && (
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category.isOverBudget ? 'bg-danger' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(category.percentage, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
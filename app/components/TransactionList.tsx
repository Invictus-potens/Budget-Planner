'use client';

import { useState } from 'react';
import { Transaction } from '../types/budget';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ACCOUNTS } from '../lib/constants';
import { exportToCSV } from '../lib/storage';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  selectedMonth: string;
}

export default function TransactionList({ transactions, onDelete, selectedMonth }: TransactionListProps) {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const monthTransactions = transactions.filter(t => 
    t.date.startsWith(selectedMonth)
  );

  const filteredTransactions = monthTransactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      comparison = a.amount - b.amount;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const allCategories = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const getCategoryInfo = (categoryId: string) => {
    return allCategories.find(c => c.id === categoryId) || { name: 'Unknown', icon: 'ri-question-line', color: 'bg-gray-500' };
  };

  const getAccountInfo = (accountId: string) => {
    return ACCOUNTS.find(a => a.id === accountId) || { name: 'Unknown', icon: 'ri-question-line' };
  };

  const handleExport = () => {
    const exportData = sortedTransactions.map(t => ({
      Date: t.date,
      Type: t.type,
      Category: getCategoryInfo(t.category).name,
      Description: t.description,
      Account: getAccountInfo(t.account ?? '').name,
      Amount: t.amount,
    }));
    exportToCSV(exportData, `transactions-${selectedMonth}.csv`);
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-semibold text-text flex items-center">
          <i className="ri-list-check-line text-primary mr-2"></i>
          Transações ({sortedTransactions.length})
        </h2>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium whitespace-nowrap flex items-center"
          disabled={sortedTransactions.length === 0}
          title="Exportar transações para Excel"
        >
          <i className="ri-download-line mr-2"></i>
          Exportar Excel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            title="Filtrar por tipo"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            title="Filtrar por categoria"
          >
            <option value="all">Todas as categorias</option>
            {allCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            title="Ordenar por"
          >
            <option value="date">Data</option>
            <option value="amount">Valor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ordem</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            title="Ordem de exibição"
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigas</option>
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <i className="ri-file-list-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Nenhuma transação encontrada</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTransactions.map(transaction => {
            const category = getCategoryInfo(transaction.category);
            const account = getAccountInfo(transaction.account ?? '');
            
            return (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-surface rounded-lg hover:bg-surface transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-white`}></i>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-text">{category.name}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-success-light text-success-dark' 
                          : 'bg-danger-light text-danger-dark'
                      }`}>
                        {transaction.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{transaction.description || 'Nenhuma descrição'}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted mt-1">
                      <span className="flex items-center">
                        <i className="ri-calendar-line mr-1"></i>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <i className={`${account.icon} mr-1`}></i>
                        {account.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-success' : 'text-danger'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="w-8 h-8 flex items-center justify-center text-muted hover:text-danger hover:bg-danger-light rounded-full transition-colors"
                  title="Excluir transação"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
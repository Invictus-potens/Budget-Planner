'use client';

import { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ACCOUNTS } from '../lib/constants';

interface TransactionFormProps {
  onSubmit: (transaction: {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    account: string;
  }) => void;
}

export default function TransactionForm({ onSubmit }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState(ACCOUNTS[0].id);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      account,
    });

    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <i className="ri-add-circle-line text-purple-600 mr-2"></i>
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex rounded-lg bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => {setType('expense'); setCategory('');}}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              type === 'expense'
                ? 'bg-red-100 text-red-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="ri-arrow-down-line mr-1"></i>
            Expense
          </button>
          <button
            type="button"
            onClick={() => {setType('income'); setCategory('');}}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              type === 'income'
                ? 'bg-green-100 text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <i className="ri-arrow-up-line mr-1"></i>
            Income
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
          <div className="relative">
            <i className="ri-money-dollar-circle-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="relative">
            <i className="ri-price-tag-3-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm appearance-none bg-white"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
          <div className="relative">
            <i className="ri-bank-card-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm appearance-none bg-white"
            >
              {ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            <i className="ri-arrow-down-s-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="relative">
            <i className="ri-file-text-line absolute left-3 top-3 text-gray-400"></i>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none"
              placeholder="Optional description..."
              rows={3}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <div className="relative">
            <i className="ri-calendar-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-medium whitespace-nowrap transition-all ${
            type === 'expense'
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <i className="ri-add-line mr-2"></i>
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </button>
      </form>
    </div>
  );
}
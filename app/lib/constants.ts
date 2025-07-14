import { Category, Account } from '../types/budget';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Housing', icon: 'ri-home-line', color: 'bg-blue-500' },
  { id: 'transportation', name: 'Transportation', icon: 'ri-car-line', color: 'bg-green-500' },
  { id: 'food', name: 'Food & Dining', icon: 'ri-restaurant-line', color: 'bg-orange-500' },
  { id: 'healthcare', name: 'Healthcare & Insurance', icon: 'ri-heart-pulse-line', color: 'bg-red-500' },
  { id: 'debt', name: 'Debt Payments', icon: 'ri-bank-card-line', color: 'bg-gray-500' },
  { id: 'savings', name: 'Savings', icon: 'ri-safe-line', color: 'bg-emerald-500' },
  { id: 'entertainment', name: 'Entertainment', icon: 'ri-gamepad-line', color: 'bg-purple-500' },
  { id: 'personal', name: 'Personal Care', icon: 'ri-user-heart-line', color: 'bg-pink-500' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'ri-smartphone-line', color: 'bg-indigo-500' },
  { id: 'pets', name: 'Pets', icon: 'ri-heart-line', color: 'bg-amber-500' },
  { id: 'gifts', name: 'Gifts & Donations', icon: 'ri-gift-line', color: 'bg-rose-500' },
  { id: 'miscellaneous', name: 'Miscellaneous', icon: 'ri-more-line', color: 'bg-slate-500' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'ri-money-dollar-circle-line', color: 'bg-green-600' },
  { id: 'freelance', name: 'Freelance Income', icon: 'ri-computer-line', color: 'bg-blue-600' },
  { id: 'investments', name: 'Investments', icon: 'ri-line-chart-line', color: 'bg-purple-600' },
  { id: 'other', name: 'Other Income', icon: 'ri-wallet-3-line', color: 'bg-teal-600' },
];

export const ACCOUNTS: Account[] = [
  { id: 'checking', name: 'Checking Account', icon: 'ri-bank-line' },
  { id: 'savings', name: 'Savings Account', icon: 'ri-safe-line' },
  { id: 'cash', name: 'Cash', icon: 'ri-money-dollar-circle-line' },
  { id: 'credit', name: 'Credit Card', icon: 'ri-bank-card-line' },
];
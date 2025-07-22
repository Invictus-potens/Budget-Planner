import { Category, Account } from '../types/budget';

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'housing', name: 'Housing', icon: 'ri-home-line', color: 'bg-category-indigo' },
  { id: 'transportation', name: 'Transportation', icon: 'ri-car-line', color: 'bg-category-emerald' },
  { id: 'food', name: 'Food & Dining', icon: 'ri-restaurant-line', color: 'bg-category-orange' },
  { id: 'healthcare', name: 'Healthcare & Insurance', icon: 'ri-heart-pulse-line', color: 'bg-danger' },
  { id: 'debt', name: 'Debt Payments', icon: 'ri-bank-card-line', color: 'bg-category-gray' },
  { id: 'savings', name: 'Savings', icon: 'ri-safe-line', color: 'bg-success' },
  { id: 'entertainment', name: 'Entertainment', icon: 'ri-gamepad-line', color: 'bg-primary' },
  { id: 'personal', name: 'Personal Care', icon: 'ri-user-heart-line', color: 'bg-accent' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'ri-smartphone-line', color: 'bg-category-indigo' },
  { id: 'pets', name: 'Pets', icon: 'ri-heart-line', color: 'bg-warning' },
  { id: 'gifts', name: 'Gifts & Donations', icon: 'ri-gift-line', color: 'bg-danger' },
  { id: 'miscellaneous', name: 'Miscellaneous', icon: 'ri-more-line', color: 'bg-category-slate' },
];

export const INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: 'ri-money-dollar-circle-line', color: 'bg-success-dark' },
  { id: 'freelance', name: 'Freelance Income', icon: 'ri-computer-line', color: 'bg-info-dark' },
  { id: 'investments', name: 'Investments', icon: 'ri-line-chart-line', color: 'bg-primary-dark' },
  { id: 'other', name: 'Other Income', icon: 'ri-wallet-3-line', color: 'bg-category-teal' },
];

export const ACCOUNTS: Account[] = [
  { id: 'checking', name: 'Checking Account', icon: 'ri-bank-line' },
  { id: 'savings', name: 'Savings Account', icon: 'ri-safe-line' },
  { id: 'cash', name: 'Cash', icon: 'ri-money-dollar-circle-line' },
  { id: 'credit', name: 'Credit Card', icon: 'ri-bank-card-line' },
];
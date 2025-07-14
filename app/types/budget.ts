export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  account?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BudgetLimit {
  categoryId: string;
  limit: number;
}

export interface Account {
  id: string;
  name: string;
  icon: string;
}
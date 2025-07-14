'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategorySummary from './CategorySummary';
import MonthlyCharts from './MonthlyCharts';
import BudgetLimits from './BudgetLimits';
import { Transaction, BudgetLimit } from '../types/budget';
import { useAuth } from '../contexts/AuthContext';
import { 
  getTransactions, 
  saveTransaction, 
  deleteTransaction as deleteTransactionFromDB,
  getBudgetLimits,
  saveBudgetLimit,
  supabase
} from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';

export default function BudgetDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { user } = useAuth();
  const t = useTranslations();

  useEffect(() => {
    if (user) {
      loadData();
      // Subscribe to realtime inserts for this user's transactions
      const channel = supabase?.channel('realtime-transactions')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newTransaction = payload.new as Transaction;
            setTransactions((prev) => {
              // Avoid duplicates if already present
              if (prev.some(t => t.id === newTransaction.id)) return prev;
              return [...prev, newTransaction];
            });
          }
        )
        .subscribe();
      return () => {
        channel?.unsubscribe();
      };
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      const [transactionsData, limitsData] = await Promise.all([
        getTransactions(user.id),
        getBudgetLimits(user.id)
      ]);
      
      if (transactionsData.data) {
        setTransactions(transactionsData.data);
      }
      
      if (limitsData.data) {
        setBudgetLimits(limitsData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };
    // Remove 'account' before sending to Supabase
    const { account, ...transactionToInsert } = newTransaction;
    try {
      const { error } = await saveTransaction(transactionToInsert, user.id);
      if (!error) {
        setTransactions(prev => [...prev, newTransaction]);
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await deleteTransactionFromDB(id, user.id);
      if (!error) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const updateBudgetLimit = async (categoryId: string, limit: number) => {
    if (!user) return;
    
    const updatedLimits = budgetLimits.filter(l => l.categoryId !== categoryId);
    if (limit > 0) {
      updatedLimits.push({ categoryId, limit });
    }
    
    try {
      const { error } = await saveBudgetLimit({ categoryId, limit }, user.id);
      if (!error) {
        setBudgetLimits(updatedLimits);
      }
    } catch (error) {
      console.error('Error saving budget limit:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: t('tabs.overview'), icon: 'ri-dashboard-line' },
    { id: 'transactions', label: t('tabs.transactions'), icon: 'ri-list-check-line' },
    { id: 'charts', label: t('tabs.charts'), icon: 'ri-bar-chart-line' },
    { id: 'budgets', label: t('tabs.budgets'), icon: 'ri-wallet-line' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        tabs={tabs}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TransactionForm onSubmit={addTransaction} />
            </div>
            <div className="lg:col-span-2">
              <CategorySummary 
                transactions={transactions} 
                selectedMonth={selectedMonth}
                budgetLimits={budgetLimits}
              />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList 
            transactions={transactions} 
            onDelete={deleteTransaction}
            selectedMonth={selectedMonth}
          />
        )}

        {activeTab === 'charts' && (
          <MonthlyCharts 
            transactions={transactions} 
            selectedMonth={selectedMonth}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetLimits 
            budgetLimits={budgetLimits}
            onUpdate={updateBudgetLimit}
            transactions={transactions}
            selectedMonth={selectedMonth}
          />
        )}
      </main>
    </div>
  );
}
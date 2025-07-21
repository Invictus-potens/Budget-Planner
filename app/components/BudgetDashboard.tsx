'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';
import CategorySummary from './CategorySummary';
import MonthlyCharts from './MonthlyCharts';
import BudgetLimits from './BudgetLimits';
import ReceiptsUpload from './ReceiptsUpload';
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
import { useRouter } from 'next/navigation';
import SettingsPage from '../settings/page';
import { useSettingsStore } from '@/store/settingsStore';
// Removed next-intl import

function getLastBusinessDay(year: number, month: number) {
  // month is 1-based (1 = January)
  let date = new Date(year, month, 0); // last day of month
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }
  return date.getDate();
}

export default function BudgetDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimit[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { user } = useAuth();
  const { salary, payday } = useSettingsStore();
  // Removed t = useTranslations()
  const router = useRouter();

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

  useEffect(() => {
    const maybeAddSalaryTransaction = async () => {
      if (!user || !salary || !payday) return;
      if (!supabase) return;
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      let salaryDay = payday === 'lastBusinessDay'
        ? getLastBusinessDay(year, month)
        : Number(payday);

      if (today.getDate() !== salaryDay) return;

      // Check if a salary transaction already exists for this month
      const { data: existing, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .eq('description', 'Salário')
        .gte('date', `${year}-${String(month).padStart(2, '0')}-01`)
        .lte('date', `${year}-${String(month).padStart(2, '0')}-31`);

      if (!existing || existing.length === 0) {
        // Add the salary transaction
        await supabase.from('transactions').insert([{
          user_id: user.id,
          amount: salary,
          type: 'income',
          description: 'Salário',
          date: today.toISOString().slice(0, 10),
          category: 'salary',
        }]);
      }
    };

    maybeAddSalaryTransaction();
  }, [user, salary, payday]);

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
      console.error('Erro ao carregar dados:', error);
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
      console.error('Erro ao salvar transação:', error);
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
      console.error('Erro ao deletar transação:', error);
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
      console.error('Erro ao salvar limite de orçamento:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: 'ri-dashboard-line' },
    { id: 'transactions', label: 'Transações', icon: 'ri-list-check-line' },
    { id: 'charts', label: 'Gráficos', icon: 'ri-bar-chart-line' },
    { id: 'budgets', label: 'Limites de Orçamento', icon: 'ri-wallet-line' },
    { id: 'receipts', label: 'Recibos e Boletos', icon: 'ri-file-list-3-line' },
    { id: 'settings', label: 'Configurações', icon: 'ri-settings-3-line' },
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
        {activeTab === 'receipts' && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-purple-700 mb-6">Recibos & Boletos</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <ReceiptsUpload />
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </main>
    </div>
  );
}
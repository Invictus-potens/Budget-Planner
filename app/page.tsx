'use client';

import { useAuth } from './contexts/AuthContext';
import BudgetDashboard from './components/BudgetDashboard';
import AuthPage from './auth/page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-accent-light flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-primary mb-4"></i>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <BudgetDashboard />;
}
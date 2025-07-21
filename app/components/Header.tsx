'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: Tab[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export default function Header({ activeTab, setActiveTab, tabs, selectedMonth, setSelectedMonth }: HeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Budgeteer
            </h1>
            
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  <i className={`${tab.icon} text-sm`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <i className="ri-calendar-line text-gray-500"></i>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
              aria-label="Selecione o mês"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <i className="ri-logout-box-r-line"></i>
              <span>Sair</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex space-x-1 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center space-x-1 ${
                activeTab === tab.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <i className={`${tab.icon} text-xs`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
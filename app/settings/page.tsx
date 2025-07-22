'use client';
import { FinancialSettings } from './components/FinancialSettings';
import { QuickActions } from './components/QuickActions';
import { AccountUsers } from './components/AccountUsers';
import { RegisteredSalaries } from './components/RegisteredSalaries';
import { Preferences } from './components/Preferences';
import { CustomCategories } from './components/CustomCategories';
import { Reminders } from './components/Reminders';
import { SidebarInfo } from './components/SidebarInfo';

export default function SettingsPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6">
      <main className="flex-1 space-y-8">
        <FinancialSettings />
        <QuickActions />
        <AccountUsers />
        <RegisteredSalaries />
        <Preferences />
        <CustomCategories />
        <Reminders />
      </main>
      <aside className="w-full md:w-80">
        <SidebarInfo />
      </aside>
    </div>
  );
} 
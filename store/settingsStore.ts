import create from 'zustand';
import { persist } from 'zustand/middleware';

export type Currency = 'BRL' | 'USD';
export type MemberRole = 'owner' | 'adult' | 'child';

export interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: 'active' | 'pending' | 'suspended';
  avatarUrl?: string;
  allowance?: number;
}

export interface Salary {
  id: string;
  memberId: string;
  amount: number;
  frequency: 'monthly' | 'biweekly';
  startDate: string;
  included: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  isDefault: boolean;
  visibleTo: 'all' | string[];
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  repeat: 'none' | 'monthly' | string;
  memberIds: string[];
}

export interface SettingsState {
  salary: number | null;
  payday: number | 'lastBusinessDay';
  currency: Currency;
  notifications: boolean;
  darkTheme: boolean;
  members: Member[];
  invites: any[];
  salaries: Salary[];
  categories: Category[];
  reminders: Reminder[];
  set: (partial: Partial<SettingsState>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      salary: null,
      payday: 1,
      currency: 'BRL',
      notifications: true,
      darkTheme: false,
      members: [],
      invites: [],
      salaries: [],
      categories: [],
      reminders: [],
      set: (partial) => set(partial),
      reset: () => set({
        salary: null,
        payday: 1,
        currency: 'BRL',
        notifications: true,
        darkTheme: false,
        members: [],
        invites: [],
        salaries: [],
        categories: [],
        reminders: [],
      }),
    }),
    { name: 'settings-store' }
  )
); 
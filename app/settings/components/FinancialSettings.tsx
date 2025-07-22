'use client';

import { useEffect, useState } from 'react';
import { Card } from './Card';
import { useSettingsStore } from '@/store/settingsStore';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function FinancialSettings() {
  const { salary, payday, currency, set } = useSettingsStore();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load settings from DB on mount or when user changes
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      if (!supabase) {
        setMessage('Supabase client não inicializado.');
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('user_financial_settings')
        .select('salary, payday, currency')
        .eq('user_id', user.id)
        .single();
      setLoading(false);
      if (error) {
        setMessage('Erro ao carregar configurações: ' + error.message);
      } else if (data) {
        set({
          salary: data.salary ?? null,
          payday: data.payday ?? 1,
          currency: data.currency ?? 'BRL',
        });
      }
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setMessage('Você precisa estar logado.');
      return;
    }
    if (!supabase) {
      setMessage('Supabase client não inicializado.');
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await supabase
      .from('user_financial_settings')
      .upsert({
        user_id: user.id,
        salary,
        payday: payday === 'lastBusinessDay' ? null : payday,
        currency,
      }, { onConflict: 'user_id' });
    setSaving(false);
    if (error) {
      setMessage('Erro ao salvar: ' + error.message);
    } else {
      setMessage('Configurações salvas com sucesso!');
    }
  };

  return (
    <Card id="financialsettings-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-pink-500 text-2xl">💸</span>
        <h2 className="text-lg font-semibold text-gray-800">Configurações Financeiras</h2>
      </div>
      {loading && (
        <div className="text-gray-500 text-sm mb-2">Carregando configurações...</div>
      )}
      <label className="text-gray-500 font-medium">Salário Principal (Opcional)
        <input
          type="number"
          className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          value={salary ?? ''}
          onChange={e => set({ salary: Number(e.target.value) || null })}
          placeholder="0"
        />
      </label>
      <label className="text-gray-500 font-medium">Dia do Salário
        <select
          className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 bg-white"
          value={payday}
          onChange={e => set({ payday: e.target.value === 'lastBusinessDay' ? 'lastBusinessDay' : Number(e.target.value) })}
        >
          {[...Array(31)].map((_, i) => (
            <option key={i+1} value={i+1}>{`Dia ${i+1}`}</option>
          ))}
          <option value="lastBusinessDay">Último dia útil</option>
        </select>
      </label>
      <div>
        <span className="text-gray-500 font-medium">Moeda Padrão</span>
        <div className="flex gap-2 mt-2">
          {[
            { code: 'BRL', label: 'Real (R$)', hint: 'Brasileiro' },
            { code: 'USD', label: 'Dólar ($)', hint: 'Americano' },
          ].map(opt => (
            <button
              key={opt.code}
              type="button"
              className={`px-4 py-2 rounded-md font-semibold border transition
                ${currency === opt.code
                  ? 'bg-pink-100 text-pink-600 border-pink-500'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-pink-500'}
              `}
              onClick={() => set({ currency: opt.code as any })}
            >
              <div className="text-sm">{opt.label}</div>
              <div className="text-xs text-gray-500">{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>
      <button
        className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-md shadow transition"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
      {message && (
        <div className={`mt-2 text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </Card>
  );
} 
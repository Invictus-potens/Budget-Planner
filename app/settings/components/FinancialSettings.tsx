import { useEffect, useState } from 'react';
import { Card } from './Card';
import { useSettingsStore } from '@/store/settingsStore';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-magenta text-2xl">💸</span>
        <h2 className="text-lg font-semibold text-grayDark">Configurações Financeiras</h2>
      </div>
      {loading && (
        <div className="text-grayMedium text-sm mb-2">Carregando configurações...</div>
      )}
      <label className="text-grayMedium font-medium">Salário Principal (Opcional)
        <input
          type="number"
          className="mt-1 block w-full border border-grayLight rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-magenta focus:border-magenta"
          value={salary ?? ''}
          onChange={e => set({ salary: Number(e.target.value) || null })}
          placeholder="0"
        />
      </label>
      <label className="text-grayMedium font-medium">Dia do Salário
        <select
          className="mt-1 block w-full border border-grayLight rounded-md px-3 py-2 bg-white"
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
        <span className="text-grayMedium font-medium">Moeda Padrão</span>
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
                  ? 'bg-pastelPink text-magenta border-magenta'
                  : 'bg-white border-grayLight text-grayMedium hover:border-magenta'}
              `}
              onClick={() => set({ currency: opt.code as any })}
            >
              <div className="text-sm">{opt.label}</div>
              <div className="text-xs text-grayMedium">{opt.hint}</div>
            </button>
          ))}
        </div>
      </div>
      <button
        className="mt-4 bg-magenta text-white font-semibold px-6 py-2 rounded-md shadow hover:bg-pink-600 transition"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
      {message && (
        <div className={`mt-2 text-sm ${message.includes('sucesso') ? 'text-green' : 'text-red'}`}>
          {message}
        </div>
      )}
    </Card>
  );
} 
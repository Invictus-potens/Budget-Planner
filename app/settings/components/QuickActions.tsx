'use client';

import { Card } from './Card';
import { useSettingsStore } from '@/store/settingsStore';

export function QuickActions() {
  const { reset } = useSettingsStore();

  function resetData() {
    if (window.confirm('Tem certeza que deseja resetar todos os dados?')) {
      reset();
      window.location.reload();
    }
  }

  return (
    <Card className="gap-3" id="quickactions-card">
      <h2 className="text-lg font-semibold text-green flex items-center gap-2 mb-2">
        <span className="text-green text-2xl">⚡</span> Ações Rápidas
      </h2>
      <button className="w-full bg-green text-white font-semibold py-3 rounded-md shadow hover:bg-green-600 transition">
        Salvar Configurações
      </button>
      <button className="w-full bg-red text-white font-semibold py-3 rounded-md shadow hover:bg-red-600 transition">
        Resetar Dados
      </button>
    </Card>
  );
} 
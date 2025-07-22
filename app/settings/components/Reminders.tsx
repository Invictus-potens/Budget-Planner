'use client';

import { Card } from './Card';

export function Reminders() {
  return (
    <Card id="reminders-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-purple text-2xl">⏰</span>
        <h2 className="text-lg font-semibold text-grayDark">Lembretes</h2>
      </div>
      <div className="text-grayMedium mb-2">Nenhum lembrete cadastrado. Adicione lembretes para não esquecer de pagamentos e metas importantes.</div>
      <button className="bg-purple text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-purple-700 transition">
        + Adicionar Lembrete
      </button>
    </Card>
  );
} 
'use client';

import { Card } from './Card';

export function RegisteredSalaries() {
  return (
    <Card id="registeredsalaries-card">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-green text-2xl">💵</span>
        <h2 className="text-lg font-semibold text-grayDark">Salários Cadastrados</h2>
      </div>
      <div className="text-grayMedium mb-2">Nenhum salário cadastrado. Adicione salários para controle automático de rendas.</div>
      <button className="bg-green text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-green-600 transition">
        + Adicionar Salário
      </button>
    </Card>
  );
} 
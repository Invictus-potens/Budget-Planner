import { Card } from './Card';

export function AccountUsers() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue text-2xl">👤</span>
        <h2 className="text-lg font-semibold text-grayDark">Usuários do Sistema</h2>
      </div>
      <div className="text-grayMedium mb-2">Nenhum usuário cadastrado. Adicione usuários para separar as movimentações financeiras.</div>
      <button className="bg-magenta text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-pink-600 transition">
        + Adicionar Usuário
      </button>
    </Card>
  );
} 
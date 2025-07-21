import { Card } from './Card';

export function CustomCategories() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-orange text-2xl">🏷️</span>
        <h2 className="text-lg font-semibold text-grayDark">Categorias Personalizadas</h2>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {['Alimentação', 'Transporte', 'Contas', 'Saúde', 'Compras', 'Lazer', 'Educação', 'Casa', 'Poupança', 'Investimentos'].map(cat => (
          <span key={cat} className="bg-grayBg border border-grayLight text-grayDark rounded-full px-3 py-1 text-xs">{cat}</span>
        ))}
      </div>
      <button className="bg-magenta text-white font-semibold px-4 py-2 rounded-md shadow hover:bg-pink-600 transition">
        + Adicionar
      </button>
    </Card>
  );
} 
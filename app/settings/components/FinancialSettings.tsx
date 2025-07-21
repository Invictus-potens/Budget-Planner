import { Card } from './Card';
import { useSettingsStore } from '@/store/settingsStore';

export function FinancialSettings() {
  const { salary, payday, currency, set } = useSettingsStore();
  return (
    <Card>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-magenta text-2xl">💸</span>
        <h2 className="text-lg font-semibold text-grayDark">Configurações Financeiras</h2>
      </div>
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
    </Card>
  );
} 
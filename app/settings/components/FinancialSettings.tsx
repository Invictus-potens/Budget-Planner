import { useSettingsStore } from '@/store/settingsStore';

export function FinancialSettings() {
  const { salary, payday, currency, set } = useSettingsStore();
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Financial Settings</h2>
      <div className="flex flex-col gap-4">
        <label>
          Primary Salary
          <input
            type="number"
            className="input"
            value={salary ?? ''}
            onChange={e => set({ salary: Number(e.target.value) || null })}
            placeholder="e.g. 5000"
          />
        </label>
        <label>
          Payday
          <select
            className="input"
            value={payday}
            onChange={e => set({ payday: e.target.value === 'lastBusinessDay' ? 'lastBusinessDay' : Number(e.target.value) })}
          >
            {[...Array(31)].map((_, i) => (
              <option key={i+1} value={i+1}>{i+1}</option>
            ))}
            <option value="lastBusinessDay">Last Business Day</option>
          </select>
        </label>
        <div>
          Default Currency
          <div className="flex gap-2 mt-1">
            {['BRL', 'USD'].map(cur => (
              <button
                key={cur}
                className={`px-3 py-1 rounded ${currency === cur ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => set({ currency: cur as any })}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 
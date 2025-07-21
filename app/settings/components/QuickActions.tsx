import { useSettingsStore } from '@/store/settingsStore';

export function QuickActions() {
  const { reset } = useSettingsStore();

  function resetData() {
    if (window.confirm('Are you sure you want to reset all settings?')) {
      reset();
      window.location.reload();
    }
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <button className="btn btn-primary" onClick={() => alert('Settings saved! (MVP: auto-saved)')}>
        Save Settings
      </button>
      <button className="btn btn-danger ml-4" onClick={resetData}>
        Reset Data
      </button>
    </section>
  );
} 
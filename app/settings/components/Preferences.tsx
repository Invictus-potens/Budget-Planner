'use client';

import { useEffect } from 'react';
import { Card } from './Card';
import { useSettingsStore } from '../../../store/settingsStore';

export function Preferences() {
  const darkTheme = useSettingsStore((s) => s.darkTheme);
  const set = useSettingsStore((s) => s.set);
  
  console.log('darkTheme:', darkTheme);

  // Aplicar o tema escuro no HTML quando o estado mudar
  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkTheme]);

  // Carregar o tema salvo na inicialização
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      set({ darkTheme: isDark });
    }
  }, [set]);

  const toggleDarkTheme = () => {
    const newTheme = !darkTheme;
    set({ darkTheme: newTheme });
    // Salvar no localStorage
    localStorage.setItem('darkTheme', JSON.stringify(newTheme));
  };

  return (
    <Card id="preferences-card">
      <div id="preferences-header" className="flex items-center gap-2 mb-2">
        <span className="text-grayDark text-2xl">⚙️</span>
        <h2 className="text-lg font-semibold text-grayDark">Preferências</h2>
      </div>
      <div id="preferences-notifications" className="flex items-center justify-between mb-2">
        <span className="text-grayMedium">Notificações</span>
        <label className="inline-flex items-center cursor-pointer relative">
          <input type="checkbox" className="sr-only peer" aria-label="Notificações" />
          <div className="w-11 h-6 bg-grayLight dark:bg-gray-700 rounded-full peer peer-checked:bg-blue transition-all shadow-inner"></div>
          <div className="absolute w-5 h-5 bg-white dark:bg-gray-900 border border-grayLight dark:border-gray-700 rounded-full left-1 top-0.5 peer-checked:translate-x-full peer-checked:border-blue transition-all shadow"></div>
        </label>
      </div>
      <div id="preferences-darkmode" className="flex items-center justify-between">
        <span className="text-grayMedium">Tema Escuro</span>
        <label className="inline-flex items-center cursor-pointer relative">
          <input
            id="darkmode-toggle"
            type="checkbox"
            className="sr-only peer"
            checked={darkTheme}
            onChange={toggleDarkTheme}
            aria-label="Tema Escuro"
          />
          <div className="w-11 h-6 bg-grayLight dark:bg-gray-700 rounded-full peer peer-checked:bg-blue transition-all shadow-inner"></div>
          <div className="absolute w-5 h-5 bg-white dark:bg-gray-900 border border-grayLight dark:border-gray-700 rounded-full left-1 top-0.5 peer-checked:translate-x-full peer-checked:border-blue transition-all shadow"></div>
        </label>
      </div>
    </Card>
  );
}
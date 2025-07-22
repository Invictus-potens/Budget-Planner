'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

type Mode = 'login' | 'forgot';

export default function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('login');
  const [resetMessage, setResetMessage] = useState('');
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetMessage('');
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    } else if (mode === 'forgot') {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setResetMessage('Password reset email sent! Please check your inbox.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface rounded-2xl shadow-xl p-8 border border-primary-light">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            {mode === 'login' ? 'Bem-vindo de volta' : 'Redefinir Senha'}
          </h1>
          <p className="text-muted">
            {mode === 'login'
              ? 'Faça login em sua conta Budgeteer'
              : 'Digite seu email para receber um link de redefinição de senha'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-danger-light border border-danger-light rounded-lg p-3">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}
          {resetMessage && (
            <div className="bg-success-light border border-success-light rounded-lg p-3">
              <p className="text-success-dark text-sm">{resetMessage}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              Endereço de Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200"
              placeholder="Digite seu email"
            />
          </div>

          {mode === 'login' && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200"
                placeholder="Digite sua senha"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-3 px-4 rounded-lg hover:from-primary-dark hover:to-accent-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                {mode === 'login' ? 'Entrando...' : 'Enviando...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => { setMode('forgot'); setError(''); setResetMessage(''); }}
                className="text-primary hover:text-primary-dark font-medium transition-colors duration-200 mb-2"
              >
                Esqueceu sua senha?
              </button>
              <p className="text-muted">
                Don't have an account?{' '}
                <button
                  onClick={onToggleMode}
                  className="text-primary hover:text-primary-dark font-medium transition-colors duration-200"
                >
                  Cadastre-se aqui
                </button>
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setMode('login'); setError(''); setResetMessage(''); }}
                className="text-primary hover:text-primary-dark font-medium transition-colors duration-200 mb-2"
              >
                Voltar para o Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
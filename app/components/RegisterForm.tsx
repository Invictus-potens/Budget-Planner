'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormProps {
  onToggleMode: () => void;
}

export default function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface rounded-2xl shadow-xl p-8 border border-primary-light text-center">
          <div className="mb-6">
            <i className="ri-mail-check-line text-5xl text-success text-500 mb-4"></i>
            <h1 className="text-2xl font-bold text-text mb-2">Verifique seu Email</h1>
            <p className="text-muted">
              Nós enviamos um link de confirmação para <strong>{email}</strong>
            </p>
          </div>
          <p className="text-sm text-muted mb-6">
            Por favor, verifique seu email e clique no link de confirmação para ativar sua conta.
          </p>
          <button
            onClick={onToggleMode}
            className="text-primary text-500 hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Voltar para o Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface rounded-2xl shadow-xl p-8 border border-primary-light">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Criar Conta
          </h1>
          <p className="text-muted">Junte-se ao Budgeteer para começar a gerenciar suas finanças</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-danger-light border border-danger-light rounded-lg p-3">
              <p className="text-danger text-sm">{error}</p>
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
              placeholder="Crie uma senha (mínimo de 6 caracteres)"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-2">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent transition-all duration-200"
              placeholder="Confirme sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-3 px-4 rounded-lg hover:from-primary-700 hover:to-accent-700 focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Criando Conta...
              </div>
            ) : (
              'Criar Conta'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted">
            Já tem uma conta?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary text-500 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              Faça login aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 
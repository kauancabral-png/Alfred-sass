import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://fincontrol-saas-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao fazer login');
      
      localStorage.setItem('token', data.token);
      if (data.user && data.user.name) {
          localStorage.setItem('userName', data.user.name);
      }
      navigate('/dashboard');
    } catch (err) {
      toast('Aviso: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans items-center relative overflow-hidden">
      
      {/* Visual background details */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl fade-in" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-500/10 rounded-full blur-3xl fade-in" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 fade-in">
        <div className="flex justify-center flex-col items-center">
          <img src="/logo-alfred-black.png" alt="Alfred" className="w-32 h-32 object-contain rounded-3xl mb-6 shadow-2xl shadow-slate-300" />
          <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
             Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 font-medium tracking-wide">
             Gerencie suas finanças com facilidade
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 fade-in" style={{animationDelay: '0.1s'}}>
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-slate-50/50 outline-none transition-colors"
                  placeholder="voce@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Senha</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary sm:text-sm bg-slate-50/50 outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-light">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? 'Autenticando...' : 'Entrar no Sistema'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
